import { useSQLiteContext } from "expo-sqlite"

export type CostumerServiceDatabase = {
  id: number
  clientName: string
  clientPhone: string
  serviceType: string
  schedulingDate: string
  schedulingTime: string
}

export function useCostumerServiceDatabase() {
  const database = useSQLiteContext()

  async function create(data: Omit<CostumerServiceDatabase, "id">) {
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
      if (insertedRowId){
        return { status: 'success'}
      }
     return {status: 'error'}
    } catch (error) {
      throw error
    } finally {
      await statement.finalizeAsync()
    }
  }

  async function update(data: CostumerServiceDatabase) {
    // Prepare a statement with dynamic column updates
    const statement = await database.prepareAsync(
      "UPDATE products SET clientName = $clientName, clientPhone = $clientPhone, serviceType = $serviceType, schedulingDate = $schedulingDate, schedulingTime = $schedulingTime WHERE id = $id"
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
    } catch (error) {
      // Handle any errors that occur during execution
      throw error;
    } finally {
      // Finalize the statement to release resources
      await statement.finalizeAsync();
    }
  }

  async function remove(id: number) {
    try {
      await database.execAsync("DELETE FROM products WHERE id = " + id)
    } catch (error) {
      throw error
    }
  }

  async function show(id: number) {
    try {
      const query = "SELECT * FROM products WHERE id = ?"

      const response = await database.getFirstAsync<CostumerServiceDatabase>(query, [
        id,
      ])

      return response
    } catch (error) {
      throw error
    }
  }

  return { create, update, remove, show }
}
