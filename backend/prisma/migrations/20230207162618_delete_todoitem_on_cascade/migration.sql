-- DropForeignKey
ALTER TABLE "TodoItem" DROP CONSTRAINT "TodoItem_todoListId_fkey";

-- AddForeignKey
ALTER TABLE "TodoItem" ADD CONSTRAINT "TodoItem_todoListId_fkey" FOREIGN KEY ("todoListId") REFERENCES "TodoList"("id") ON DELETE CASCADE ON UPDATE CASCADE;
