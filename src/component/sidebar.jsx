import React, { useContext } from "react";
import { Sidebar } from "flowbite-react";
import AuthContext from "./shared/AuthContext";

export default function SidebarNav() {
  const { user } = useContext(AuthContext);

  return (
    <Sidebar
      aria-label="Sidebar with multi-level dropdown example"
      className="fixed top-0 left-0 z-40 w-64 h-screen pt-20 transition-transform -translate-x-full bg-white border-r border-gray-200 sm:translate-x-0 dark:bg-white-800 dark:border-gray-700"
    >
      <Sidebar.Items>
        <Sidebar.ItemGroup>
          <Sidebar.Item href="/">Dashboard</Sidebar.Item>
          <Sidebar.Collapse label="Management">
            {user?.role === "SUPER_ADMIN" && (
              <Sidebar.Item href="/admin">Admin</Sidebar.Item>
            )}
            <Sidebar.Item href="#">KRS Action</Sidebar.Item>
          </Sidebar.Collapse>
          <Sidebar.Item href="#">Conversation</Sidebar.Item>
          <Sidebar.Collapse label="Component">
            <Sidebar.Item href="#">Intent</Sidebar.Item>
            <Sidebar.Item href="/action">Action</Sidebar.Item>
            <Sidebar.Item href="/utterance">Utterance</Sidebar.Item>
          </Sidebar.Collapse>
          <Sidebar.Collapse label="Train">
            <Sidebar.Item href="#">Train Model</Sidebar.Item>
            {user?.role === "SUPER_ADMIN" && (
              <Sidebar.Item href="#">Model Configuration</Sidebar.Item>
            )}
          </Sidebar.Collapse>
          <Sidebar.Item href="#">Logout</Sidebar.Item>
        </Sidebar.ItemGroup>
      </Sidebar.Items>
    </Sidebar>
  );
}
