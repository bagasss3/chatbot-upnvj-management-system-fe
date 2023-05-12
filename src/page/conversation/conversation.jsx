import React, { useState, useEffect } from "react";
import Navbar from "../../component/navbar";
import { Button, Modal } from "flowbite-react";
import SidebarNav from "../../component/sidebar";
import SearchComponent from "../../component/searchbar";
import useAxios from "../../interceptor/useAxios";

export default function ConversationPage() {
  const [addConversation, setAddConversation] = useState(false);
  const [rules, setRules] = useState([]);
  const [stories, setStories] = useState([]);
  const [deleteRuleId, setDeleteRuleId] = useState(null);
  const [deleteRuleIndex, setDeleteRuleIndex] = useState(null);
  const [deleteStoryId, setDeleteStoryId] = useState(null);
  const [deleteStoryIndex, setDeleteStoryIndex] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  let api = useAxios();

  const onClickAdd = () => {
    setAddConversation(true);
  };

  const onClickDelete = (index) => {
    setDeleteRuleIndex(index);
    const ruleIdToDelete = rules[index].id;
    setDeleteRuleId(ruleIdToDelete);
  };

  function handleSearchTermChange(e) {
    setSearchTerm(e.target.value);
  }

  const handleSubmit = async (event) => {
    try {
      event.preventDefault();
      const response = await api.get(
        `${process.env.REACT_APP_API_URL}/story?name=${searchTerm}`
      );
      setStories(response.data);

      const responseRule = await api.get(
        `${process.env.REACT_APP_API_URL}/rule?name=${searchTerm}`
      );
      setRules(responseRule.data);
    } catch (err) {
      console.log(err);
    }
  };

  const handleDelete = async () => {
    try {
      await api.delete(`${process.env.REACT_APP_API_URL}/rule/${deleteRuleId}`);
      // Success message or redirect to table page
      console.log("success delete Rule");
      setRules((prevData) =>
        prevData.filter((intent, index) => index !== deleteRuleIndex)
      );
    } catch (error) {
      console.log(error);
      // Error message
    } finally {
      setDeleteRuleId(null);
    }
  };

  const onClickDeleteStory = (index) => {
    setDeleteStoryIndex(index);
    const storyIdToDelete = stories[index].id;
    setDeleteStoryId(storyIdToDelete);
  };

  const handleDeleteStory = async () => {
    try {
      await api.delete(
        `${process.env.REACT_APP_API_URL}/story/${deleteStoryId}`
      );
      // Success message or redirect to table page
      console.log("success delete story");
      setStories((prevData) =>
        prevData.filter((story, index) => index !== deleteStoryIndex)
      );
    } catch (error) {
      console.log(error);
      // Error message
    } finally {
      setDeleteStoryId(null);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const responseStories = await api.get(
          `${process.env.REACT_APP_API_URL}/story`
        );
        console.log(responseStories);
        setStories(responseStories.data);

        const responseRules = await api.get(
          `${process.env.REACT_APP_API_URL}/rule`
        );
        console.log(responseRules);
        setRules(responseRules.data);
      } catch (error) {
        console.log(error);
      }
    };
    fetchData();
  }, [api]);

  return (
    <div>
      <Navbar />
      <SidebarNav />
      <div className="p-4 sm:ml-64">
        <div className="p-4 border-2 border-gray-200 border-dashed rounded-lg dark:border-gray-700 mt-14">
          <div className="border-2 border-gray-200 border-dashed dark:border-gray-700 mb-5">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold py-6 ml-3">Conversation</h2>
              <Button className="mr-3" onClick={onClickAdd}>
                Add
              </Button>
            </div>
            <div className="mb-3">
              <SearchComponent
                onSubmit={handleSubmit}
                onChange={handleSearchTermChange}
              />
            </div>
          </div>
          <div>
            <h2 className="text-2xl font-bold py-6 ml-3">Stories</h2>
            <div className="grid grid-cols-3 gap-4 mb-4">
              {stories.length > 0 ? (
                stories.map((story, index) => (
                  <div
                    className="max-w-sm p-6 bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700 relative"
                    key={story.id}
                  >
                    <div className="flex justify-end">
                      <button
                        onClick={() => onClickDeleteStory(index)}
                        className="mb-2 inline-flex items-center px-3 py-2 text-sm font-medium text-center text-white bg-red-700 rounded-lg hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-red-300 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-800"
                      >
                        Delete
                      </button>
                    </div>
                    <div>
                      <a href="/">
                        <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
                          {story.story_title}
                        </h5>
                      </a>
                      <p className="mb-3 font-normal text-gray-700 dark:text-gray-400">
                        Story
                      </p>
                    </div>
                    <div className="flex justify-end">
                      <a
                        href={`/conversation/story/edit/${story.id}`}
                        className="mt-5 inline-flex items-center px-3 py-2 text-sm font-medium text-center text-white bg-green-700 rounded-lg hover:bg-green-800 focus:ring-4 focus:outline-none focus:ring-green-300 dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800"
                      >
                        Ubah
                        <svg
                          aria-hidden="true"
                          className="w-4 h-4 ml-2 -mr-1"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            fillRule="evenodd"
                            d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z"
                            clipRule="evenodd"
                          ></path>
                        </svg>
                      </a>
                    </div>
                  </div>
                ))
              ) : (
                <div className="ml-3">Empty Stories</div>
              )}
            </div>
          </div>
          <div>
            <h2 className="text-2xl font-bold py-6 ml-3">Rules</h2>
            <div className="grid grid-cols-3 gap-4 mb-4">
              {rules.length > 0 ? (
                rules.map((rule, index) => (
                  <div
                    className="max-w-sm p-6 bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700 relative"
                    key={rule.id}
                  >
                    <div className="flex justify-end">
                      <button
                        onClick={() => onClickDelete(index)}
                        className="mb-2 inline-flex items-center px-3 py-2 text-sm font-medium text-center text-white bg-red-700 rounded-lg hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-red-300 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-800"
                      >
                        Delete
                      </button>
                    </div>
                    <div>
                      <a href="/">
                        <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
                          {rule.rule_title}
                        </h5>
                      </a>
                      <p className="mb-3 font-normal text-gray-700 dark:text-gray-400">
                        Rule
                      </p>
                    </div>
                    <div className="flex justify-end">
                      <a
                        href={`/conversation/rule/edit/${rule.id}`}
                        className="mt-5 inline-flex items-center px-3 py-2 text-sm font-medium text-center text-white bg-green-700 rounded-lg hover:bg-green-800 focus:ring-4 focus:outline-none focus:ring-green-300 dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800"
                      >
                        Ubah
                        <svg
                          aria-hidden="true"
                          className="w-4 h-4 ml-2 -mr-1"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            fillRule="evenodd"
                            d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z"
                            clipRule="evenodd"
                          ></path>
                        </svg>
                      </a>
                    </div>
                  </div>
                ))
              ) : (
                <div className="ml-3">Empty Rules</div>
              )}
            </div>
          </div>
        </div>
        <Modal
          show={addConversation !== false}
          popup={true}
          onClose={() => setAddConversation(false)}
        >
          <Modal.Header>Pilih Tipe Conversation</Modal.Header>
          <Modal.Body>
            <div className="space-y-6">
              <div className="flex justify-center">
                <a
                  href="/conversation/rule/add"
                  className="w-1/2 px-10 py-6 rounded-lg border-2 border-gray-400 bg-white mr-3 hover:bg-gray-400 focus:outline-none text-center"
                >
                  Rule
                </a>
                <a
                  href="/conversation/story/add"
                  className="w-1/2 px-10 py-6 rounded-lg border-2 border-gray-400 bg-white mr-3 hover:bg-gray-400 focus:outline-none text-center"
                >
                  Story
                </a>
              </div>
            </div>
          </Modal.Body>
        </Modal>
        <Modal
          show={deleteRuleId !== null}
          size="md"
          popup={true}
          onClose={() => setDeleteRuleId(null)}
        >
          <Modal.Header />
          <Modal.Body>
            <div className="text-center">
              <h3 className="mb-5 text-lg font-normal text-gray-500 dark:text-gray-400">
                Are you sure you want to delete this product?
              </h3>
              <div className="flex justify-center gap-4">
                <Button color="failure" onClick={handleDelete}>
                  Yes, I'm sure
                </Button>
              </div>
            </div>
          </Modal.Body>
        </Modal>
        <Modal
          show={deleteStoryId !== null}
          size="md"
          popup={true}
          onClose={() => setDeleteStoryId(null)}
        >
          <Modal.Header />
          <Modal.Body>
            <div className="text-center">
              <h3 className="mb-5 text-lg font-normal text-gray-500 dark:text-gray-400">
                Are you sure you want to delete this product?
              </h3>
              <div className="flex justify-center gap-4">
                <Button color="failure" onClick={handleDeleteStory}>
                  Yes, I'm sure
                </Button>
              </div>
            </div>
          </Modal.Body>
        </Modal>
      </div>
    </div>
  );
}
