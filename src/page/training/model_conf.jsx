import React, { useState, useEffect } from "react";
import Navbar from "../../component/navbar";
import SidebarNav from "../../component/sidebar";
import useAxios from "../../interceptor/useAxios";
import { Helmet } from "react-helmet";

export default function ModelConfigurationPage() {
  const [modelConfigurationData, setModelConfigurationData] = useState(null);
  const [utteranceData, setUtteranceData] = useState([]);
  const [selectedInputUtterance, setSelectedInputUtterance] = useState("");
  const [dietClassifierEpoch, setDietClassifierEpoch] = useState(0);
  const [fallbackClassifierTreshold, setFallbackClassifierTreshold] =
    useState(0);
  const [responseSelectorEpoch, setResponseSelectorEpoch] = useState(0);
  const [tedPolicyEpoch, setTedPolicyEpoch] = useState(0);
  const [unexpectedIntentPolicyEpoch, setUnexpectedIntentPolicyEpoch] =
    useState(0);
  const [rulePolicyFallbackTreshold, setRulePolicyFallbackTreshold] =
    useState(0);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  let api = useAxios();

  function handleSelectedInputUtterance(e) {
    setSelectedInputUtterance(e.target.value);
  }

  function handleDietClassifierEpochChange(e) {
    setDietClassifierEpoch(e.target.value);
  }

  function handleFallbackClassifierTresholdChange(e) {
    setFallbackClassifierTreshold(e.target.value);
  }

  function handleResponseSelectorEpochChange(e) {
    setResponseSelectorEpoch(e.target.value);
  }

  function handleTedPolicyEpochChange(e) {
    setTedPolicyEpoch(e.target.value);
  }

  function handleUnexpectedIntentEpochChange(e) {
    setUnexpectedIntentPolicyEpoch(e.target.value);
  }

  function handleRulePolicyFallbackTreshold(e) {
    setRulePolicyFallbackTreshold(e.target.value);
  }

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await api.get(
          `${process.env.REACT_APP_API_URL}/configuration`
        );
        setModelConfigurationData(response.data[0]);
        console.log(response.data[0]);
        const data = response.data[0];
        setDietClassifierEpoch(data.diet_classifier_epoch);
        setFallbackClassifierTreshold(data.fallback_classifier_treshold);
        setResponseSelectorEpoch(data.response_selector_epoch);
        setTedPolicyEpoch(data.ted_policy_epoch);
        setSelectedInputUtterance(data.fallback_utterance_id);
        setRulePolicyFallbackTreshold(data.fallback_treshold);
        setUnexpectedIntentPolicyEpoch(data.unexpected_intent_policy_epoch);

        const responseUtterance = await api.get(
          `${process.env.REACT_APP_API_URL}/utterance`
        );
        console.log(responseUtterance);
        setUtteranceData(responseUtterance.data);
      } catch (error) {
        console.log(error);
      }
    };
    fetchData();
  }, [api]);

  async function handleSave(e) {
    e.preventDefault();
    setIsLoading(true);
    try {
      let payload = {
        diet_classifier_epoch: parseInt(dietClassifierEpoch),
        fallback_classifier_treshold: parseFloat(fallbackClassifierTreshold),
        response_selector_epoch: parseInt(responseSelectorEpoch),
        ted_policy_epoch: parseInt(tedPolicyEpoch),
        fallback_utterance_id: selectedInputUtterance,
        fallback_treshold: parseFloat(rulePolicyFallbackTreshold),
        unexpected_intent_policy_epoch: parseInt(unexpectedIntentPolicyEpoch),
      };

      const res = await api.put(
        `${process.env.REACT_APP_API_URL}/configuration/${modelConfigurationData.id}`,
        payload
      );
      console.log(res);
      console.log("Success Save Configuration");
      setSuccess("success save current configuration");
      setTimeout(() => {
        setSuccess("");
      }, 5000);
    } catch (error) {
      if (error.response.statusText === "Bad Request") {
        const errorData = JSON.parse(error.response.data.message);
        const errorMessages = Object.entries(errorData).map(
          ([key, value]) => `- ${key} ${value}`
        );
        setError(errorMessages);
      } else {
        if (error.response.data.message === "unauthorized") {
          setError("no permission to edit configuration");
        } else {
          setError(error.response.message);
        }
      }
      setTimeout(() => {
        setError("");
      }, 5000);
    } finally {
      setIsLoading(false);
    }
  }
  return (
    <div>
      <Helmet>
        <title>Model Configuration</title>
      </Helmet>
      <Navbar />
      <SidebarNav />
      <div className="p-4 sm:ml-64">
        <div className="p-4 border-2 border-gray-200 border-dashed rounded-lg dark:border-gray-700 mt-14">
          <div className="grid grid-cols-2 gap-4 mb-4">
            <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
              Model Configuration
            </h5>
          </div>
          <div className="col-start-1 col-span 4 ...">
            <p>
              Konfigurasi ini adalah komponen dan aturan yang digunakan oleh
              model anda untuk memprediksi respon dari input pengguna.
            </p>
          </div>
          <div className="grid grid-cols-6 gap-4 mt-4">
            <div className="grid grid-cols-2">
              <h5 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
                Pipeline
              </h5>
            </div>
            <div className="col-start-1 col-end-7 ml-3 ...">
              <ol className="relative border-l border-gray-200 dark:border-gray-700">
                <li className="mb-10 ml-6">
                  <span className="absolute flex items-center justify-center w-6 h-6 bg-blue-100 rounded-full -left-3 ring-8 ring-white dark:ring-gray-900 dark:bg-blue-900"></span>
                  <h3 className="flex items-center mb-1 text-lg font-semibold text-gray-900 dark:text-white">
                    WhitespaceTokenizer
                  </h3>
                </li>
                <li className="mb-10 ml-6">
                  <span className="absolute flex items-center justify-center w-6 h-6 bg-blue-100 rounded-full -left-3 ring-8 ring-white dark:ring-gray-900 dark:bg-blue-900"></span>
                  <h3 className="mb-1 text-lg font-semibold text-gray-900 dark:text-white">
                    RegexFeaturizer
                  </h3>
                </li>
                <li className="mb-10 ml-6">
                  <span className="absolute flex items-center justify-center w-6 h-6 bg-blue-100 rounded-full -left-3 ring-8 ring-white dark:ring-gray-900 dark:bg-blue-900"></span>
                  <h3 className="mb-1 text-lg font-semibold text-gray-900 dark:text-white">
                    LexicalSyntacticFeaturizer
                  </h3>
                </li>
                <li className="mb-10 ml-6">
                  <span className="absolute flex items-center justify-center w-6 h-6 bg-blue-100 rounded-full -left-3 ring-8 ring-white dark:ring-gray-900 dark:bg-blue-900"></span>
                  <h3 className="flex items-center mb-1 text-lg font-semibold text-gray-900 dark:text-white">
                    CountVectorsFeaturizer
                  </h3>
                </li>
                <li className="mb-10 ml-6">
                  <span className="absolute flex items-center justify-center w-6 h-6 bg-blue-100 rounded-full -left-3 ring-8 ring-white dark:ring-gray-900 dark:bg-blue-900"></span>
                  <h3 className="flex items-center mb-1 text-lg font-semibold text-gray-900 dark:text-white">
                    CountVectorsFeaturizer
                  </h3>
                  <div>
                    <p>
                      analyzer: <span className="text-blue-800">char_wb</span>
                    </p>
                    <p>
                      min_ngram: <span className="text-blue-800">1</span>
                    </p>
                    <p>
                      max_ngram: <span className="text-blue-800">4</span>
                    </p>
                  </div>
                </li>
                <li className="mb-10 ml-6">
                  <span className="absolute flex items-center justify-center w-6 h-6 bg-blue-100 rounded-full -left-3 ring-8 ring-white dark:ring-gray-900 dark:bg-blue-900"></span>
                  <h3 className="flex items-center mb-1 text-lg font-semibold text-gray-900 dark:text-white">
                    DIETClassifier
                  </h3>
                  <div>
                    <label>Epoch</label>
                    <input
                      className="flex mb-3"
                      type="number"
                      placeholder="Enter Epoch"
                      value={dietClassifierEpoch}
                      onChange={handleDietClassifierEpochChange}
                    />
                  </div>
                </li>
                <li className="mb-10 ml-6">
                  <span className="absolute flex items-center justify-center w-6 h-6 bg-blue-100 rounded-full -left-3 ring-8 ring-white dark:ring-gray-900 dark:bg-blue-900"></span>
                  <h3 className="flex items-center mb-1 text-lg font-semibold text-gray-900 dark:text-white">
                    FallbackClassifier
                  </h3>
                  <div>
                    <label>Treshold</label>
                    <input
                      className="flex mb-3"
                      type="number"
                      placeholder="Enter Treshold"
                      value={fallbackClassifierTreshold}
                      onChange={handleFallbackClassifierTresholdChange}
                    />
                  </div>
                </li>
                <li className="mb-10 ml-6">
                  <span className="absolute flex items-center justify-center w-6 h-6 bg-blue-100 rounded-full -left-3 ring-8 ring-white dark:ring-gray-900 dark:bg-blue-900"></span>
                  <h3 className="flex items-center mb-1 text-lg font-semibold text-gray-900 dark:text-white">
                    EntitySynonymMapper
                  </h3>
                </li>
                <li className="ml-6">
                  <span className="absolute flex items-center justify-center w-6 h-6 bg-blue-100 rounded-full -left-3 ring-8 ring-white dark:ring-gray-900 dark:bg-blue-900"></span>
                  <h3 className="flex items-center mb-1 text-lg font-semibold text-gray-900 dark:text-white">
                    ResponseSelector
                  </h3>
                  <div>
                    <label>Epoch</label>
                    <input
                      className="flex mb-3"
                      type="number"
                      placeholder="Enter Epoch"
                      value={responseSelectorEpoch}
                      onChange={handleResponseSelectorEpochChange}
                    />
                  </div>
                </li>
              </ol>
            </div>
          </div>
          <div className="grid grid-cols-6 gap-4 mt-4">
            <div className="grid grid-cols-2">
              <h5 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
                Policy
              </h5>
            </div>
            <div className="col-start-1 col-end-7 ml-3 ...">
              <ol className="relative border-l border-gray-200 dark:border-gray-700">
                <li className="mb-10 ml-6">
                  <span className="absolute flex items-center justify-center w-6 h-6 bg-blue-100 rounded-full -left-3 ring-8 ring-white dark:ring-gray-900 dark:bg-blue-900"></span>
                  <h3 className="flex items-center mb-1 text-lg font-semibold text-gray-900 dark:text-white">
                    MemoizationPolicy
                  </h3>
                </li>
                <li className="mb-10 ml-6">
                  <span className="absolute flex items-center justify-center w-6 h-6 bg-blue-100 rounded-full -left-3 ring-8 ring-white dark:ring-gray-900 dark:bg-blue-900"></span>
                  <h3 className="flex items-center mb-1 text-lg font-semibold text-gray-900 dark:text-white">
                    TEDPolicy
                  </h3>
                  <div>
                    <p>
                      max_history: <span className="text-blue-800">5</span>
                    </p>
                    <label>epoch</label>
                    <input
                      className="flex mb-3"
                      type="number"
                      placeholder="Enter Epoch"
                      value={tedPolicyEpoch}
                      onChange={handleTedPolicyEpochChange}
                    />
                  </div>
                </li>
                <li className="mb-10 ml-6">
                  <span className="absolute flex items-center justify-center w-6 h-6 bg-blue-100 rounded-full -left-3 ring-8 ring-white dark:ring-gray-900 dark:bg-blue-900"></span>
                  <h3 className="flex items-center mb-1 text-lg font-semibold text-gray-900 dark:text-white">
                    UnexpecTEDIntentPolicy
                  </h3>
                  <div>
                    <p>
                      max_history: <span className="text-blue-800">5</span>
                    </p>
                    <label>epoch</label>
                    <input
                      className="flex mb-3"
                      type="number"
                      placeholder="Enter Epoch"
                      value={unexpectedIntentPolicyEpoch}
                      onChange={handleUnexpectedIntentEpochChange}
                    />
                  </div>
                </li>
                <li className="mb-10 ml-6">
                  <span className="absolute flex items-center justify-center w-6 h-6 bg-blue-100 rounded-full -left-3 ring-8 ring-white dark:ring-gray-900 dark:bg-blue-900"></span>
                  <h3 className="flex items-center mb-1 text-lg font-semibold text-gray-900 dark:text-white">
                    RulePolicy
                  </h3>
                  <div>
                    <label>core_fallback_threshold</label>
                    <input
                      className="flex mb-3"
                      type="number"
                      placeholder="Enter Fallback Treshold"
                      value={rulePolicyFallbackTreshold}
                      onChange={handleRulePolicyFallbackTreshold}
                    />
                    <label>core_fallback_action_name</label>
                    <select
                      className="flex border p-2 mr-2"
                      id="input-list"
                      value={selectedInputUtterance}
                      onChange={handleSelectedInputUtterance}
                    >
                      <option value="" disabled>
                        Select option
                      </option>
                      {utteranceData.map((input) => (
                        <option key={input.id} value={input.id}>
                          {input.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </li>
              </ol>
            </div>
          </div>
          {success && <div className="text-green-500 py-2">{success}</div>}
          {error && <div className="text-red-500 py-2">{error}</div>}
          <div className="flex justify-end">
            <button
              className="border py-2 px-4 bg-indigo-600 hover:bg-indigo-500 text-white"
              type="button"
              onClick={handleSave}
              disabled={isLoading}
            >
              {isLoading ? "Menyimpan..." : "Simpan"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
