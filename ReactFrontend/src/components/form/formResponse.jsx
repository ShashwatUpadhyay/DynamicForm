import React, { useState, useEffect  }  from 'react';
import { Pie, Bar } from 'react-chartjs-2';
import { Link, useParams } from "react-router-dom";
import axios from 'axios';
import { API_BASE_URL } from "/config";


import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
} from 'chart.js';
import FormHeader from './formHeader.jsx';

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title);

const dummySummary = {
  totalResponses: 128,
  avgScore: 7.4,
  lastResponse: '2024-06-10 14:23',
  questions: [
    {
      id: 1,
      question: 'What is your favorite color?',
      type: 'multiple choice',
      chartType: 'pie',
      options: ['Red', 'Blue', 'Green', 'Yellow'],
      responses: [32, 54, 22, 20],
    },
    {
      id: 2,
      question: 'Select your hobbies',
      type: 'checkbox',
      chartType: 'bar',
      options: ['Reading', 'Sports', 'Music', 'Travel'],
      responses: [60, 40, 80, 50],
    },
    {
      id: 3,
      question: 'Any suggestions?',
      type: 'long answer',
      chartType: null,
      responses: [
        'Great form!',
        'Loved the UI.',
        'Add more options.',
      ],
    },
  ],
};

const chartColors = [
  '#3b82f6', '#f59e42', '#10b981', '#f43f5e', '#6366f1', '#fbbf24', '#22d3ee', '#a3e635',
];

function FormResponse() {
    const { code } = useParams();
    const [responseCount, setResponseCount] = useState();

    const [lastResponse, setLastResponse] = useState();
    const [todayResponses, setTodayResponses] = useState();
    const [questions, setQuestions] = useState([]);

    function formatDateTime(datetimeStr) {
        const date = new Date(datetimeStr);
        const day = date.getDate().toString().padStart(2, '0');
        const month = date.toLocaleString('default', { month: 'long' }); // e.g., "July"
        const year = date.getFullYear();
        const hours = date.getHours().toString().padStart(2, '0');
        const minutes = date.getMinutes().toString().padStart(2, '0');
        return `${day}-${month}-${year} - ${hours}:${minutes}`;
      }
      
    useEffect(() => {
        try {
            axios.get(`${API_BASE_URL}response/get_response?code=${code}`)
              .then((res) => {                
                if (res.data.status === true) {
                    console.log(res.data);
                    setResponseCount(res.data.data.total_responses);
                    setLastResponse(res.data.data.lastResponse)
                    setTodayResponses(res.data.data.today_responses)
                    setQuestions(res.data.data.questions)
                }
            }, []);
        } catch (error) {
            console.log(error);
        }
    },[]);

  return (
    <>
      <FormHeader activeTab={'responses'} formisSaving={false} code={code} />
      <div style={{ backgroundColor: '#f3f4f6', minHeight: '100vh' }} className="py-10  font-[Verdana]">
        <div className="max-w-2xl mx-auto flex flex-col gap-6 mt-[80px]">
          {/* Summary Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 ">

            <div className="bg-white rounded-xl shadow p-4 border-t-8 border-blue-500 flex flex-col items-center">
              <span className="text-2xl font-bold text-blue-600">{responseCount}</span>
              <span className="text-gray-600 text-sm">Total Responses</span>
            </div>
            <div className="bg-white rounded-xl shadow p-4 border-t-8 border-green-500 flex flex-col items-center">
              <span className="text-2xl font-bold text-green-600">{todayResponses}</span>
              <span className="text-gray-600 text-sm">Today Responses</span>
            </div>
            <div className="bg-white rounded-xl shadow p-4 border-t-8 border-purple-500 flex flex-col items-center">
              <span className="text-md font-bold text-purple-600">{formatDateTime(lastResponse)}</span>
              <span className="text-gray-600 text-sm">Last Response</span>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-1 gap-4 ">
            <button className='text-center bg-blue-200'>
                Export CSV
            </button>
          </div>

          {/* Questions & Graphs */}
          <div className="flex flex-col gap-8">
            {questions.map((q, idx) => (
              <div key={q.id} className="bg-white rounded-xl shadow p-6 border-l-4 border-blue-500">
                <div className="mb-4">
                  <span className="font-semibold text-lg text-gray-800">Q{idx + 1}. {q.question}</span>
                </div>
                {q.chartType === 'pie' && (
                  <Pie
                    data={{
                      labels: q.options,
                      datasets: [
                        {
                          data: q.responses,
                          backgroundColor: chartColors.slice(0, q.options.length),
                        },
                      ],
                    }}
                    options={{
                      plugins: {
                        legend: {
                          position: 'bottom',
                        },
                      },
                    }}
                    className="w-full md:w-1/2 mx-auto"
                  />
                )}
                {q.chartType === 'bar' && (
                  <Bar
                    data={{
                      labels: q.options,
                      datasets: [
                        {
                          label: 'Responses',
                          data: q.responses,
                          backgroundColor: chartColors.slice(0, q.options.length),
                        },
                      ],
                    }}
                    options={{
                      plugins: {
                        legend: {
                          display: false,
                        },
                      },
                      scales: {
                        y: {
                          beginAtZero: true,
                        },
                      },
                    }}
                    className="w-full md:w-2/3 mx-auto"
                  />
                )}
                {q.chartType === '' && (
                    <div className="flex flex-col gap-2 mt-2 max-h-[200px] overflow-scroll">
                    {q.answers.map((resp, i) => (
                      <div key={i} className="bg-gray-100 rounded max-w-full p-2 text-gray-700 text-sm">
                        {resp.split(" ").slice(0, 6).join(" ")}...
                      </div>
                    ))}
                  </div>
                    )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}

export default FormResponse; 