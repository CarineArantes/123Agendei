import { useSQLiteContext } from "expo-sqlite"
import { MessageUserKeys } from '../keys'

export function useServiceDatabase() {
  const database = useSQLiteContext()

  async function create(data) {
    const statement = await database.prepareAsync(
      "INSERT INTO service (active, name, description, favorite, createAt) VALUES ($active, $name, $description, $favorite, $createAt)"
    );
    try {
      const result = await statement.executeAsync({
        $active: data.active,
        $name: data.name,
        $description: data.description,
        $favorite: data.favorite,
        $createAt: data.createAt,
      });

      const insertedRowId = result.lastInsertRowId.toLocaleString();
      if (insertedRowId) {
        return {
          status: 'success',
          message: MessageUserKeys.SERVICE_CREATED,
        };
      }
      throw new Error(MessageUserKeys.SERVICE_ERROR);
    } catch (error) {
      return {
        status: 'error',
        message: MessageUserKeys.SERVICE_ERROR,
      };
    } finally {
      await statement.finalizeAsync();
    }
  }

  async function update(data) {
    const statement = await database.prepareAsync(
      "UPDATE service SET active = $active, name = $name, description = $description, favorite = $favorite WHERE id = $id"
    );

    try {
      const result = await statement.executeAsync({
        $active: data.active,
        $name: data.name,
        $description: data.description,
        $favorite: data.favorite,
        $id: data.id,
      });
      if (result.changes > 0) {
        return {
          status: 'success',
          message: MessageUserKeys.SERVICE_UPDATED,
        };
      }
      throw new Error(MessageUserKeys.SERVICE_NOT_FOUND);
    } catch (error) {
      return {
        status: 'error',
        message: MessageUserKeys.SERVICE_ERROR,
      };
    } finally {
      await statement.finalizeAsync();
    }
  }
  
  async function remove(id) {
    const statement = await database.prepareAsync(
      "UPDATE service SET active = 0 WHERE id = $id"
    );
    try {
      await statement.executeAsync({
        $id: id,
      });
      return {
        status: 'success',
        message: MessageUserKeys.SERVICE_DELETED,
      };
    } catch (error) {
      return {
        status: 'error',
        message: MessageUserKeys.SERVICE_ERROR,
      };
    } finally {
      await statement.finalizeAsync();
    }
  }

  async function findAllOrderedByName() {
    try {
      const query = "SELECT * FROM service WHERE active = 1 ORDER BY favorite DESC, name ASC";
      const response = await database.getAllAsync(query);
      return response;
    } catch (error) {
      console.error(error);
      return [];
    }
  }

  async function removeAffinity(serviceId) {
    const statement = await database.prepareAsync(`
      DELETE FROM affinity WHERE serviceId = $serviceId
    `);
    try {
      const result = await statement.executeAsync({
        $serviceId: serviceId,
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

  return { create, findAllOrderedByName, update, remove, removeAffinity };
}
