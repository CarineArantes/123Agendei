import { useSQLiteContext } from "expo-sqlite"
import { MessageUserKeys } from ''

export function useCostumerServiceDatabase() {
  const database = useSQLiteContext()

  async function create(data) {
    const statement = await database.prepareAsync(
      "INSERT INTO costumerService (clientName, clientPhone, serviceType, schedulingDate, schedulingTime) VALUES ($clientName, $clientPhone, $serviceType, $schedulingDate, $schedulingTime)"
    )
    try {
      const result = await statement.executeAsync({
        $clientName: data.clientName,
        $clientPhone: data.clientPhone,
        $serviceType: data.serviceType,
        $schedulingDate: data.schedulingDate,
        $schedulingTime: data.schedulingTime,
      })

      const insertedRowId = result.lastInsertRowId.toLocaleString()
      if (insertedRowId) {
        return {
          status: 'success',
          message: MessageUserKeys.SCHEDULING_CREATED
        }
      }
      throw new Error(MessageUserKeys.SCHEDULING_ERROR)
    } catch (error) {
      return {
        status: 'error',
        message: MessageUserKeys.SCHEDULING_ERROR
      }
    } finally {
      await statement.finalizeAsync()
    }
  }
  async function update(data) {
    // Prepare a statement with dynamic column updates
    const statement = await database.prepareAsync(
      "UPDATE costumerService SET clientName = $clientName, clientPhone = $clientPhone, serviceType = $serviceType, schedulingDate = $schedulingDate, schedulingTime = $schedulingTime WHERE id = $id"
    );

    try {
      // Execute the statement with the data provided
      await statement.executeAsync({
        $id: data.id,
        $clientName: data.clientName,
        $clientPhone: data.clientPhone,
        $serviceType: data.serviceType,
        $schedulingDate: data.schedulingDate,
        $schedulingTime: data.schedulingTime,
      });
      return {
        status: 'success',
        message: MessageUserKeys.SCHEDULING_UPDATED
      }
    } catch (error) {
      return {
        status: 'error',
        message: MessageUserKeys.SCHEDULING_ERROR
      }
    } finally {
      // Finalize the statement to release resources
      await statement.finalizeAsync();
    }
  }
  async function remove(id) {
    try {
      await database.execAsync("DELETE FROM costumerService WHERE id = " + id)
      return {
        status: 'success',
        message: MessageUserKeys.SCHEDULING_DELETED
      }
    } catch (error) {
      console.error(error)
      return {
        status: 'error',
        message: MessageUserKeys.SCHEDULING_DELETE_ERROR
      }
    }
  }
  async function show(id) {
    try {
      const query = "SELECT * FROM costumerService WHERE id = ?"

      const response = await database.getFirstAsync(query, [
        id,
      ])

      return response
    } catch (error) {
      throw error
    }
  }
  async function findByDate(schedulingDate) {
    try {
      const query = "SELECT * FROM costumerService WHERE schedulingDate = ? ORDER BY schedulingTime ASC";
      const response = await database.getAllAsync(query, [schedulingDate]);
      return response;

    } catch (error) {
      console.error(error);
      return [];
    }
  }
  async function findByDateAndTime(schedulingDate, schedulingTime, id) {
    try {
      const query = "SELECT * FROM costumerService WHERE schedulingDate = ? AND schedulingTime = ? AND id != ? ORDER BY schedulingTime ASC";
      const response = await database.getAllAsync(query, [schedulingDate, schedulingTime, id]);
      return response;

    } catch (error) {
      console.error(error);
      return [];
    }
  }


  return { create, update, remove, show, findByDate, findByDateAndTime }
}
