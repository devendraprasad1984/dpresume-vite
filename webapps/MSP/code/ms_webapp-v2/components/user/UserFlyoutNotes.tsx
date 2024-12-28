import React, { useCallback, useEffect, useState } from "react";
import { observer } from "mobx-react-lite";
import dayjs from "dayjs";
import { INote } from "ms-npm/admin-models";

import useAdminStores from "../../stores/admin-context";
import styles from "./UserFlyoutNotes.module.scss";
import adminService from "../../services/admin-service";
import NoteButton from "../buttons/NoteButton";
import Tooltip from "../core/Tooltip";
import MoreActions from "../core/MoreActions";
import AddNoteModal from "../admin/AddNoteModal";
import useToast from "../../hooks/use-toast";
import DeleteNoteModal from "../admin/DeleteNoteModal";
import fullName from "../../utils/full-name";

const UserFlyoutNotes = observer(() => {
  const { adminUserStore } = useAdminStores();
  const { showServerError, showSuccessMessage } = useToast();

  const [isNoteModalOpen, setIsNoteModalOpen] = useState(false);
  const [isDeleteNoteModalOpen, setIsDeleteNoteModalOpen] = useState(false);

  const [notes, setNotes] = useState<INote[]>([]);
  const [selectedNote, setSelectedNote] = useState<INote>(null);

  const formatDate = (date: string) => {
    if (!date) return;
    return dayjs(date).format("MMMM DD, YYYY [at] h:MM a");
  };

  const onAddNote = () => {
    setIsNoteModalOpen(true);
  };

  const onCloseAddModal = () => {
    setSelectedNote(null);
    setIsNoteModalOpen(false);
  };

  const onAddNoteConfirm = async (newNote: string) => {
    const body = {
      userId: adminUserStore?.user?.id,
      status: "active",
      text: newNote,
    };
    try {
      await adminService.addNote(body);
      setIsNoteModalOpen(false);

      showSuccessMessage({
        title: "Note Added",
        message: "New note has been successfully added.",
      });

      fetchNotes();
    } catch (error) {
      showServerError(error);
    }
  };

  const onEditNote = (note: INote) => {
    setSelectedNote(note);
    setIsNoteModalOpen(true);
  };

  const onEditNoteConfirm = async (noteText: string) => {
    try {
      await adminService.updateNote(selectedNote?.id, {
        text: noteText,
      });
      setIsNoteModalOpen(false);
      setSelectedNote(null);
      fetchNotes();

      showSuccessMessage({
        title: "Note Update",
        message: "The note has been successfully updated.",
      });
    } catch (error) {
      showServerError(error);
    }
  };

  const onCloseDeleteModal = () => {
    setSelectedNote(null);
    setIsDeleteNoteModalOpen(false);
  };

  const onDeleteNote = (note: INote) => {
    setSelectedNote(note);
    setIsDeleteNoteModalOpen(true);
  };

  const onDeleteNoteConfirm = async () => {
    try {
      await adminService.deleteNote(selectedNote?.id);
      setIsDeleteNoteModalOpen(false);
      setSelectedNote(null);
      fetchNotes();

      showSuccessMessage({
        title: "Note Deleted",
        message: "The note has been successfully deleted.",
      });
    } catch (error) {
      showServerError(error);
    }
  };

  const fetchNotes = useCallback(async () => {
    try {
      const res = await adminService.fetchNotes({
        filter: "getByUserId",
        data: {
          userId: adminUserStore?.user?.userId,
        },
      });

      setNotes(res?.data?.result);
    } catch (error) {
      showServerError(error);
    }
  }, [adminUserStore?.user?.userId, showServerError]);

  useEffect(() => {
    fetchNotes();

    return () => {
      setNotes([]);
    };
  }, [fetchNotes, adminUserStore?.user]);

  return (
    <>
      <div>
        <div className={styles.header}>
          <div className={styles.noteTitle}>
            {notes?.length} {notes?.length > 1 ? "Notes" : "Note"}
          </div>
          <Tooltip placement="left" overlay="NEW NOTE">
            <div>
              <NoteButton size="sm" onClick={onAddNote} />
            </div>
          </Tooltip>
        </div>
        <ul>
          {notes?.map((item) => (
            <li className={styles.noteCard} key={item?.id}>
              <div className={styles.noteHeader}>
                <div>
                  <div className={styles.userName}>
                    {fullName([
                      adminUserStore?.user?.basicInfo?.firstName,
                      adminUserStore?.user?.basicInfo?.lastName,
                    ])}
                  </div>
                  <div className={styles.noteDate}>
                    {formatDate(item?.audit?.createdOn as string)}
                  </div>
                </div>
                <MoreActions
                  id="note-actions"
                  size="sm"
                  actions={[
                    {
                      key: "edit",
                      name: "Edit",
                      icon: "edit",
                      onClick: () => onEditNote(item),
                    },
                    {
                      key: "delete",
                      name: "Delete",
                      icon: "trash",
                      isDestructive: true,
                      onClick: () => onDeleteNote(item),
                    },
                  ]}
                />
              </div>
              <div className={styles.noteText}>{item?.text}</div>
            </li>
          ))}
        </ul>
      </div>
      {isNoteModalOpen && (
        <AddNoteModal
          isOpen={isNoteModalOpen}
          onRequestClose={onCloseAddModal}
          name={fullName([
            adminUserStore.user?.basicInfo?.firstName,
            adminUserStore.user?.basicInfo?.lastName,
          ])}
          note={selectedNote?.text}
          onConfirm={selectedNote ? onEditNoteConfirm : onAddNoteConfirm}
        />
      )}
      {isDeleteNoteModalOpen && (
        <DeleteNoteModal
          isOpen={isDeleteNoteModalOpen}
          onRequestClose={onCloseDeleteModal}
          note={selectedNote}
          onConfirm={onDeleteNoteConfirm}
        />
      )}
    </>
  );
});

export default UserFlyoutNotes;
