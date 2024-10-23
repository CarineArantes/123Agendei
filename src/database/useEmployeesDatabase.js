import { useSQLiteContext } from "expo-sqlite"
import { MessageUserKeys } from '../keys'

export function useEmployeesDatabase() {

  const database = useSQLiteContext()

  async function findAllEmployeesWithServices() {
    try {
      const query = `
        SELECT e.id AS employeeId, e.name, a.serviceId
        FROM employees e
        LEFT JOIN affinity a ON e.id = a.employeeId
        WHERE e.active = 1 ORDER BY e.name ASC
      `;
      const response = await database.getAllAsync(query);
      const employees = response.reduce((acc, row) => {
        const { employeeId, name, serviceId } = row;

        if (!acc[employeeId]) {
          acc[employeeId] = {
            id: employeeId,
            name: name,
            affinity: [],
          };
        }

        if (serviceId) {
          acc[employeeId].affinity.push(serviceId);
        }

        return acc;
      }, {});
      return Object.values(employees);
    } catch (error) {
      console.error(error);
      return [];
    }
  }
  async function create(data) {
    const statement = await database.prepareAsync(
      "INSERT INTO employees (active, name, createAt) VALUES ($active, $name, $createAt)"
    );
    try {
      const result = await statement.executeAsync({
        $active: data.active,
        $name: data.name,
        $createAt: data.createAt,
      });
      const insertedRowId = result.lastInsertRowId.toLocaleString();
      if (insertedRowId) {
        return {
          status: 'success',
          message: MessageUserKeys.EMPLOYEE_CREATED,
          employeeID: insertedRowId,
        };
      }
      throw new Error(MessageUserKeys.EMPLOYEE_CREATED_ERROR);
    } catch (error) {
      return {
        status: 'error',
        message: MessageUserKeys.EMPLOYEE_CREATED_ERROR,
      };
    } finally {
      await statement.finalizeAsync();
    }
  }
  async function update(data) {
    const statement = await database.prepareAsync(
      "UPDATE employees SET active = $active, name = $name WHERE id = $id"
    );
    try {
      const result = await statement.executeAsync({
        $id: data.id,
        $active: data.active,
        $name: data.name
      });
      if (result.changes > 0) {
        return {
          status: 'success',
          message: MessageUserKeys.EMPLOYEE_UPDATED,
        };
      }
      throw new Error(MessageUserKeys.EMPLOYEE_NOT_FOUND);
    } catch (error) {
      return {
        status: 'error',
        message: MessageUserKeys.EMPLOYEE_UPDATE_ERROR,
      };
    } finally {
      await statement.finalizeAsync();
    }
  }
  async function remove(id) {
    const statement = await database.prepareAsync(
      "UPDATE employees SET active = 0 WHERE id = $id"
    );
    try {
      await statement.executeAsync({
        $id: id,
      });
      return {
        status: 'success',
        message: MessageUserKeys.EMPLOYEE_CREATED,
      };
    } catch (error) {
      return {
        status: 'error',
        message: MessageUserKeys.EMPLOYEE_CREATED_ERROR,
      };
    } finally {
      await statement.finalizeAsync();
    }
  }
  async function addAffinity(employeeId, serviceIds) {
    const statement = await database.prepareAsync(`
      INSERT OR IGNORE INTO affinity (employeeId, serviceId)
      VALUES ($employeeId, $serviceId)
    `);
    try {
      const promises = serviceIds.map(async (serviceId) => {
        const result = await statement.executeAsync({
          $employeeId: employeeId,
          $serviceId: serviceId,
        });
        return result;
      });
      await Promise.all(promises);
      return {
        status: 'success',
        message: MessageUserKeys.SERVICES_ASSOCIATED,
      };
    } catch (error) {
      return {
        status: 'error',
        message: MessageUserKeys.SERVICES_ASSOCIATION_ERROR,
      };
    } finally {
      await statement.finalizeAsync();
    }
  }
  async function removeAffinity(employeeId) {
    const statement = await database.prepareAsync(`
      DELETE FROM affinity WHERE employeeId = $employeeId
    `);
    try {
      const result = await statement.executeAsync({
        $employeeId: employeeId,
      });
      return {
        status: 'success',
        message: MessageUserKeys.AFFINITY_REMOVED,
      };
    } catch (error) {
      return {
        status: 'error',
        message: MessageUserKeys.AFFINITY_REMOVED_ERROR,
      };
    } finally {
      await statement.finalizeAsync();
    }
  }

  return { create, addAffinity, removeAffinity, findAllEmployeesWithServices, update, remove }
}
