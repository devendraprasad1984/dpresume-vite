import { RecordStatus } from "../../common/db/enums";

export const newNote = { id: 0, userId: 1, status: RecordStatus.Active, text: "Note from postman service" };

export const updateNote = { id: 0, userId: 1, status: RecordStatus.Pending, text: "New note update" };

export const updateNoteStatus = { id: 0, status: RecordStatus.Archived };
