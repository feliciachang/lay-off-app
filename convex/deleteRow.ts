import { Id, TableNames } from './_generated/dataModel'
import { mutation } from './_generated/server'

interface IDeleteRowProps {
  tableName: TableNames
  serializedId: string
}

const deleteRowMutation = mutation(async ({ db }, props: IDeleteRowProps) => {
  // construct the ID from string
  const { tableName, serializedId } = props
  const id = new Id(tableName, serializedId)

  // delete row
  return db.delete(id)
})

export default deleteRowMutation
