import * as React from "react";

export const SidebarContext = React.createContext<{
  state: "expanded" | "collapsed";
  toggleSidebar: () => void;
}>({
  state: "expanded",
  toggleSidebar: () => {},
});

export function useSidebar() {
  return React.useContext(SidebarContext);
}
