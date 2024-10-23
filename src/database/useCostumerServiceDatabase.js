import { useSQLiteContext } from "expo-sqlite"
import { MessageUserKeys } from '../keys'

export function useCostumerServiceDatabase() {

  const database = useSQLiteContext()

  async function findAll() {
    try {
      const response = await database.getAllAsync("SELECT * FROM costumerService")
      return response
    } catch (error) {
      return []
    }
  }
  async function create(data) {
    const statement = await database.prepareAsync(
      `INSERT INTO costumerService 
            (active, clientName, clientPhone, serviceType, schedulingDate, schedulingTime, createAt, servedAt, employeeId, serviceId) 
            VALUES 
            ($active, $clientName, $clientPhone, $serviceType, $schedulingDate, $schedulingTime, $createAt, $servedAt, $employeeId, $serviceId)`
    );
    try {
      const result = await statement.executeAsync({
        $clientName: data.clientName,
        $clientPhone: data.clientPhone,
        $serviceType: '',
        $schedulingDate: data.schedulingDate,
        $schedulingTime: data.schedulingTime,
        $employeeId: parseInt(data.employeeId),
        $serviceId: parseInt(data.serviceId),
        $createAt: new Date().toISOString(),
        $servedAt: null,
        $active: 1,
      });

      const insertedRowId = result.lastInsertRowId;
      if (insertedRowId) {
        return {
          status: 'success',
          message: MessageUserKeys.SCHEDULING_CREATED,
        };
      }
      throw new Error(MessageUserKeys.SCHEDULING_ERROR);
    } catch (error) {
      return {
        status: 'error',
        message: MessageUserKeys.SCHEDULING_ERROR,
      };
    } finally {
      await statement.finalizeAsync();
    }
  }
  async function update(data, id) {
    const statement = await database.prepareAsync(
      `UPDATE costumerService 
       SET clientName = $clientName, 
           clientPhone = $clientPhone, 
           schedulingDate = $schedulingDate, 
           schedulingTime = $schedulingTime, 
           employeeId = $employeeId, 
           serviceId = $serviceId 
       WHERE id = $id`
    );

    try {
      const result = await statement.executeAsync({
        $id: id,
        $clientName: data.clientName,
        $clientPhone: data.clientPhone,
        $schedulingDate: data.schedulingDate,
        $schedulingTime: data.schedulingTime,
        $employeeId: parseInt(data.employeeId),
        $serviceId: parseInt(data.serviceId),
      });
      if (result.changes > 0) {
        return {
          status: 'success',
          message: MessageUserKeys.SCHEDULING_UPDATED,
        };
      }
      throw new Error(MessageUserKeys.SCHEDULING_NOT_FOUND);
    } catch (error) {
      return {
        status: 'error',
        message: MessageUserKeys.SCHEDULING_ERROR,
      };
    } finally {
      await statement.finalizeAsync();
    }
  }
  async function remove(id) {
    const statement = await database.prepareAsync(
      `UPDATE costumerService 
       SET active = 0
       WHERE id = $id`
    );
    try {
      const result = await statement.executeAsync({ $id: id });
      if (result.changes > 0) {
        return {
          status: 'success',
          message: MessageUserKeys.SCHEDULING_ERROR,
        };
      }
      return {
        status: 'error',
        message: MessageUserKeys.SCHEDULING_NOT_FOUND,
      };
    } catch (error) {
      return {
        status: 'error',
        message: MessageUserKeys.SCHEDULING_DELETE_ERROR,
      };
    } finally {
      await statement.finalizeAsync();
    }
  }
  async function schedulingByDate(schedulingDate) {
    try {
      const query = `
        SELECT cs.*, s.name AS serviceName, e.name AS employeeName
        FROM costumerService cs
        LEFT JOIN service s ON cs.serviceId = s.id AND s.active = 1
        LEFT JOIN employees e ON cs.employeeId = e.id AND e.active = 1
        WHERE cs.schedulingDate = ? 
          AND cs.servedAt IS NULL 
          AND cs.active = 1
        ORDER BY cs.schedulingTime ASC;
      `;
      const response = await database.getAllAsync(query, [schedulingDate]);
      return response;
    } catch (error) {
      console.error(error);
      return [];
    }
  }
  async function startCostumerService(id) {
    const statement = await database.prepareAsync(
      `UPDATE costumerService 
       SET servedAt = $servedAt
       WHERE id = $id`
    );
    try {
      const result = await statement.executeAsync({
        $id: id,
        $servedAt: new Date().toISOString()
      });
      if (result.changes > 0) {
        return {
          status: 'success',
          message: MessageUserKeys.SCHEDULING_ERROR,
        };
      }
      return {
        status: 'error',
        message: MessageUserKeys.SCHEDULING_NOT_FOUND,
      };
    } catch (error) {
      return {
        status: 'error',
        message: MessageUserKeys.SCHEDULING_DELETE_ERROR,
      };
    } finally {
      await statement.finalizeAsync();
    }
  }
  async function costumerServiceByDate(schedulingDate) {
    try {
      const query = `
      SELECT 
      cs.*, 
      s.name AS serviceName, 
      e.name AS employeeName,
      DATE(cs.servedAt) AS servedDate,       -- Extraindo a data
      strftime('%H:%M', DATETIME(cs.servedAt, '-3 hours')) AS servedTime -- Extraindo a hora e minuto subtraindo 3 horas
      FROM 
          costumerService cs
      LEFT JOIN 
          service s ON cs.serviceId = s.id AND s.active = 1
      LEFT JOIN 
          employees e ON cs.employeeId = e.id AND e.active = 1
      WHERE 
          DATE(cs.servedAt) = ?
          AND cs.active = 1
      ORDER BY 
          cs.schedulingTime ASC;
          `;
      const response = await database.getAllAsync(query, [schedulingDate]);
      return response;
    } catch (error) {
      console.error(error);
      return [];
    }
  }
  async function verificationDateAndTime(schedulingDate, schedulingTime, id) {
    try {
      const query = `
      SELECT *
        FROM costumerService
        WHERE schedulingDate = ?
          AND schedulingTime = ?
          AND active = 1
          AND servedAt IS NULL
          AND id != ?;
    `;
      const response = await database.getAllAsync(query, [schedulingDate, schedulingTime, id]);
      return (response.length > 0 ? false : true);
    } catch (error) {
      console.error(error);
      return 0;
    }
  }


  return {
    create,
    update,
    remove,
    schedulingByDate,
    costumerServiceByDate,
    findAll,
    startCostumerService,
    verificationDateAndTime
  }
}
