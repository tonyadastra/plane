import { useEffect } from "react";
import { observer } from "mobx-react-lite";
// hooks
import { useApplication, useDashboard, useUser } from "hooks/store";
// components
import { TourRoot } from "components/onboarding";
import { UserGreetingsView } from "components/user";
// ui
import { Spinner } from "@plane/ui";
// images
import { DashboardWidgets } from "components/dashboard";

export const WorkspaceDashboardView = observer(() => {
  // store hooks
  const {
    eventTracker: { postHogEventTracker },
    router: { workspaceSlug },
  } = useApplication();
  const { currentUser, updateTourCompleted } = useUser();
  const { homeDashboardId, fetchHomeDashboardWidgets } = useDashboard();

  const handleTourCompleted = () => {
    updateTourCompleted()
      .then(() => {
        postHogEventTracker("USER_TOUR_COMPLETE", {
          user_id: currentUser?.id,
          email: currentUser?.email,
          state: "SUCCESS",
        });
      })
      .catch((error) => {
        console.error(error);
      });
  };

  // fetch home dashboard widgets on workspace change
  useEffect(() => {
    if (!workspaceSlug) return;

    fetchHomeDashboardWidgets(workspaceSlug);
  }, [fetchHomeDashboardWidgets, workspaceSlug]);

  return (
    <>
      {currentUser && !currentUser.is_tour_completed && (
        <div className="fixed left-0 top-0 z-20 grid h-full w-full place-items-center bg-custom-backdrop bg-opacity-50 transition-opacity">
          <TourRoot onComplete={handleTourCompleted} />
        </div>
      )}
      {homeDashboardId ? (
        <div className="space-y-7 p-7 bg-custom-background-90 h-full w-full overflow-y-auto">
          {currentUser && <UserGreetingsView user={currentUser} />}
          <DashboardWidgets />
        </div>
      ) : (
        <div className="h-full w-full grid place-items-center">
          <Spinner />
        </div>
      )}
    </>
  );
});
