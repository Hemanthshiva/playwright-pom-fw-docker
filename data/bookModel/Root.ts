import { Author } from './Author'; // Import the 'Author' interface or type declaration
import { Editor } from './Editor'; // Import the 'Editor' interface or type declaration

export interface Root {
  isbn: string
  author: Author
  editor: Editor
  title: string
  category: string[]
}