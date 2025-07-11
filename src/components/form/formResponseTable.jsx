import React, { useState, useEffect  }  from 'react';
import { Pie, Bar } from 'react-chartjs-2';
import { Link, useParams, useNavigate } from "react-router-dom";
import axios from 'axios';
import { API_BASE_URL } from "/config";
import FormHeader from './formHeader.jsx';

function FormResponseTable() {
    const { code } = useParams();
    const navigate = useNavigate();
    const [responseCount, setResponseCount] = useState();
    const [message, setMessage] = useState();
    const token = localStorage.getItem("authToken");
    const [lastResponse, setLastResponse] = useState();
    const [todayResponses, setTodayResponses] = useState();
    const [responses, setResponses] = useState([]);
    const [questions, setQuestions] = useState([]);
    const [responseLen, setResponseLen] = useState();
    const [hasSheet,setHasSheet] = useState();
    const [sheetUrl,setSheetUrl] = useState();
    const [initbtnLoading,setInitbtnLoading] = useState();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    function formatDateTime(datetimeStr) {
        const date = new Date(datetimeStr);
        const day = date.getDate().toString().padStart(2, '0');
        const month = date.toLocaleString('default', { month: 'long' }); // e.g., "July"
        const year = date.getFullYear();
        const hours = date.getHours().toString().padStart(2, '0');
        const minutes = date.getMinutes().toString().padStart(2, '0');
        return `${day}-${month}-${year} - ${hours}:${minutes}`;
      }

    function array_to_string(strr) {
      var result;
      try{
        const validJson = strr.replace(/'/g, '"');
        const arr = JSON.parse(validJson);
        result = arr.join(', ');
      }catch(err){
        return strr;
      }
      return result;
      }
      
    const initialiseGoogleSheet = ((code) => {
      setInitbtnLoading(true);
      axios.get(`${API_BASE_URL}response/create_sheet?code=${code}`,{ 
        headers: {
          Authorization: `Token ${token}`,
        },
      },)
              .then((res) => { 
                if (res.data.status === true){
                  setHasSheet(res.data.data.sheet_created);
                  setSheetUrl(res.data.data.sheet_url);
                }
                setInitbtnLoading(false);
              }).catch((err) => {
                console.log(err);
              })
    })
    useEffect(() => {
      setLoading(true);
      
      try {
        axios.get(`${API_BASE_URL}response/get_full_response?code=${code}`,{ 
          headers: {
            Authorization: `Token ${token}`,
          },
        },)
        .then((res) => {                
                setLoading(false);
                console.log(res.data);
                if (res.data.status === true) {
                    setResponseCount(res.data.data.total_responses);
                    setLastResponse(res.data.data.lastResponse)
                    setTodayResponses(res.data.data.today_responses)
                    setResponses(res.data.data.responses)
                    setQuestions(res.data.data.questions)
                    setMessage(res.data.message)
                    setHasSheet(res.data.data.has_sheet)
                    setSheetUrl(res.data.data.sheet_url)
                    const questionArray = Object.values(res?.data?.data?.responses || {});
                    setResponseLen(questionArray.length);
                }
            }, []);
        } catch (error) {
            console.log(error);
        }
    },[]);
    if (loading) return <div className="flex justify-center items-center h-screen"><div
    class="w-10 h-10 border-4 border-t-blue-500 border-gray-300 rounded-full animate-spin"
  ></div></div>;
    if (error) return <div className="flex justify-center items-center h-screen text-red-500">{error}</div>;
    // if (!form) return null;
  return (
    <>
      <FormHeader activeTab={'responses'} formisSaving={false} code={code} />
      <div style={{ backgroundColor: '#f3f4f6', minHeight: '100vh' }} className="py-10 w-[100vw]  font-[Verdana]">
        <div className="max-w-6xl mx-auto flex flex-col gap-6 mt-[80px]">
          {/* Summary Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 ">

            <div className="bg-white rounded-xl shadow p-4 border-t-8 border-blue-500 flex flex-col items-center">
              <span className="text-2xl font-bold text-blue-600">{responseCount || 0}</span>
              <span className="text-gray-600 text-sm">Total Responses</span>
            </div>
            <div className="bg-white rounded-xl shadow p-4 border-t-8 border-green-500 flex flex-col items-center">
              <span className="text-2xl font-bold text-green-600">{todayResponses || 0}</span>
              <span className="text-gray-600 text-sm">Today Responses</span>
            </div>
            <div className="bg-white rounded-xl shadow p-4 border-t-8 border-purple-500 flex flex-col items-center">
              <span className="text-md font-bold text-purple-600">{lastResponse ? (formatDateTime(lastResponse)) : ("-") }</span>
              <span className="text-gray-600 text-sm">Last Response</span>
            </div>
          </div>
          <div className="grid grid-cols-3 sm:grid-cols-3 gap-4 ">
            <button onClick={() => {navigate(`/form/${code}/response`)}} className='text-center bg-blue-200'>
                View responses
            </button>
            <button className='text-center bg-blue-200'>
                Export CSV
            </button>
            {hasSheet || 
            <button id="initialise-btn"  onClick={() => {initialiseGoogleSheet(code)}} className='text-center bg-blue-200 flex flex-row text-center px-auto'>
              {initbtnLoading === true ? (<span className="loading flex flex-row items-center mx-auto">Loading... 
                <svg width="20" height="20" viewBox="0 0 38 38"><g transform="translate(19 19)"><g transform="rotate(0)"><circle cx="0" cy="12" r="3" fill="#60A5FA" opacity="0.125"><animate attributeName="opacity" from="0.125" to="0.125" dur="1.2s" begin="0s" repeatCount="indefinite" keyTimes="0;1" values="1;0.125"></animate></circle></g><g transform="rotate(45)"><circle cx="0" cy="12" r="3" fill="#60A5FA" opacity="0.25"><animate attributeName="opacity" from="0.25" to="0.25" dur="1.2s" begin="0.15s" repeatCount="indefinite" keyTimes="0;1" values="1;0.25"></animate></circle></g><g transform="rotate(90)"><circle cx="0" cy="12" r="3" fill="#60A5FA" opacity="0.375"><animate attributeName="opacity" from="0.375" to="0.375" dur="1.2s" begin="0.3s" repeatCount="indefinite" keyTimes="0;1" values="1;0.375"></animate></circle></g><g transform="rotate(135)"><circle cx="0" cy="12" r="3" fill="#60A5FA" opacity="0.5"><animate attributeName="opacity" from="0.5" to="0.5" dur="1.2s" begin="0.44999999999999996s" repeatCount="indefinite" keyTimes="0;1" values="1;0.5"></animate></circle></g><g transform="rotate(180)"><circle cx="0" cy="12" r="3" fill="#60A5FA" opacity="0.625"><animate attributeName="opacity" from="0.625" to="0.625" dur="1.2s" begin="0.6s" repeatCount="indefinite" keyTimes="0;1" values="1;0.625"></animate></circle></g><g transform="rotate(225)"><circle cx="0" cy="12" r="3" fill="#60A5FA" opacity="0.75"><animate attributeName="opacity" from="0.75" to="0.75" dur="1.2s" begin="0.75s" repeatCount="indefinite" keyTimes="0;1" values="1;0.75"></animate></circle></g><g transform="rotate(270)"><circle cx="0" cy="12" r="3" fill="#60A5FA" opacity="0.875"><animate attributeName="opacity" from="0.875" to="0.875" dur="1.2s" begin="0.8999999999999999s" repeatCount="indefinite" keyTimes="0;1" values="1;0.875"></animate></circle></g><g transform="rotate(315)"><circle cx="0" cy="12" r="3" fill="#60A5FA" opacity="1"><animate attributeName="opacity" from="1" to="1" dur="1.2s" begin="1.05s" repeatCount="indefinite" keyTimes="0;1" values="1;1"></animate></circle></g></g></svg></span>
                ) : (
                <span className="text mx-auto">link to google sheet</span>
              )}
              
            </button>
            }
            {hasSheet &&  
            <button id="initialise-btn" className='text-center bg-blue-200 flex flex-row text-center px-auto'>
              <a href={sheetUrl} target='_blank' className="text flex flex-row mx-auto">Open google sheet
              <svg className='mx-2' width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M5 12V6C5 5.44772 5.44772 5 6 5H18C18.5523 5 19 5.44772 19 6V18C19 18.5523 18.5523 19 18 19H12M8.11111 12H12M12 12V15.8889M12 12L5 19" stroke="#464455" stroke-linecap="round" stroke-linejoin="round"></path> </g></svg>
              </a>
            </button>
          }
          </div>

          {/* Questions & Graphs */}
          { responseLen > 0 ? (
          <table className="bg-white overflow-scroll">
            <thead><tr><td className='border'>S no.</td><td className='border'>Name</td>
            {questions.map((q, idx) => (
              <td key={q.uid} className='border max-w-20'>{q.question}</td>
            ))}
            </tr>
            </thead>
            <tbody>
            {responses.map((r, idx) => (
              <tr className="p-6 border">
                <td key={r.uid} className="border">
                  <span className="font-semibold text-lg text-gray-800">{idx + 1}</span>
                </td>
                <td key={r.uid + 1} className="border">
                  <span className="font-semibold text-lg text-gray-800">{r.user.username}</span>
                </td>
              {r.response.map((a, aidx) => (
                <td key={a.uid} className="border max-w-6 overflow-hidden">
                  <span key={aidx + 1} className="font-semibold text-lg text-gray-800 max-w-20">{array_to_string(a.answer) || a.answer}</span>
                </td>
              ))}

              </tr>
            ))}
            </tbody>
          </table>
           )  : (
            <div className='text-center'>
              {message}
            </div>
          )} 
        </div>
      </div>
    </>
  );
}

export default FormResponseTable; 