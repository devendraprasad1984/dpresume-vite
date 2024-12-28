import React from "react";

import AdminUserStore from "./admin-user-store";
import AdminUsersStore from "./admin-users-store";
import AdminConversationStore from "./admin-conversation-store";
import adminPeopleStore from "./admin-people-store";
import AdminOrgsStore from "./admin-orgs-store";
import AdminOrgStore from "./admin-org-store";
import AdminTopicStore from "./admin-topics-store";
import AdminUserSessionsStore from "./admin-sessions-store";
import AdminJobStore from "./admin-jobs-store";

const appStore = React.createContext({
  adminUserStore: new AdminUserStore(),
  adminUsersStore: new AdminUsersStore(),
  adminConversationStore: new AdminConversationStore(),
  adminPeopleStore: new adminPeopleStore(),
  adminOrgsStore: new AdminOrgsStore(),
  adminOrgStore: new AdminOrgStore(),
  adminTopicsStore: new AdminTopicStore(),
  adminSessionsStore: new AdminUserSessionsStore(),
  adminJobsStore: new AdminJobStore(),
});

const useAdminStores = () => React.useContext(appStore);

export default useAdminStores;
