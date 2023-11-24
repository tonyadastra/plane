import React, { useState } from "react";
import { useRouter } from "next/router";
import { observer } from "mobx-react-lite";
// mobx store
import { useMobxStore } from "lib/mobx/store-provider";
// services
import { IssueDraftService } from "services/issue";
// hooks
import useToast from "hooks/use-toast";
// components
import { IssueFormRoot } from "components/issues/issue-modal/form";
import { ConfirmIssueDiscard } from "components/issues";
// types
import type { IIssue } from "types";

export interface DraftIssueProps {
  changesMade: Partial<IIssue> | null;
  data?: IIssue;
  onChange: (formData: Partial<IIssue> | null) => void;
  onClose: (saveDraftIssueInLocalStorage?: boolean) => void;
  onSubmit: (formData: Partial<IIssue>) => Promise<void>;
  projectId: string;
}

const issueDraftService = new IssueDraftService();

export const DraftIssueLayout: React.FC<DraftIssueProps> = observer((props) => {
  const { changesMade, data, onChange, onClose, onSubmit } = props;

  const [issueDiscardModal, setIssueDiscardModal] = useState(false);

  const { project: projectStore } = useMobxStore();
  const projects = projectStore.workspaceProjects;

  const router = useRouter();
  const { workspaceSlug, projectId } = router.query;

  const { setToastAlert } = useToast();

  const handleClose = () => {
    if (changesMade) setIssueDiscardModal(true);
    else onClose(false);
  };

  const handleCreateDraftIssue = async () => {
    if (!changesMade || !workspaceSlug || !projectId) return;

    const payload = { ...changesMade };

    await issueDraftService
      .createDraftIssue(workspaceSlug.toString(), projectId.toString(), payload)
      .then(() => {
        setToastAlert({
          type: "success",
          title: "Success!",
          message: "Draft Issue created successfully.",
        });

        onChange(null);
        setIssueDiscardModal(false);
        onClose(false);
      })
      .catch(() =>
        setToastAlert({
          type: "error",
          title: "Error!",
          message: "Issue could not be created. Please try again.",
        })
      );
  };

  // don't open the modal if there are no projects
  if (!projects || projects.length === 0) return null;

  // if project id is present in the router query, use that as the selected project id, otherwise use the first project id
  const selectedProjectId = projectId ? projectId.toString() : projects[0].id;

  return (
    <>
      <ConfirmIssueDiscard
        isOpen={issueDiscardModal}
        handleClose={() => setIssueDiscardModal(false)}
        onConfirm={handleCreateDraftIssue}
        onDiscard={() => {
          onChange(null);
          setIssueDiscardModal(false);
          onClose(false);
        }}
      />
      <IssueFormRoot
        data={data}
        onChange={onChange}
        onClose={handleClose}
        onSubmit={onSubmit}
        projectId={selectedProjectId}
      />
    </>
  );
});
