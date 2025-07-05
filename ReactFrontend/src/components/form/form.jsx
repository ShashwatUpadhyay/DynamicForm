import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { API_BASE_URL } from '/config';

function Form() {
  const { code } = useParams();
  const [form, setForm] = useState(null);
  const [responses, setResponses] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [submitStatus, setSubmitStatus] = useState(null);

  useEffect(() => {
    setLoading(true);
    axios.get(`${API_BASE_URL}form?code=${code}`)
      .then(res => {
        setForm(res.data.data);
        setLoading(false);
      })
      .catch(err => {
        setError('Failed to load form.');
        setLoading(false);
      });
  }, [code]);

  const handleChange = (questionId, value) => {
    setResponses(prev => ({ ...prev, [questionId]: value }));
  };

  const handleCheckboxChange = (questionId, choice) => {
    setResponses(prev => {
      const prevArr = Array.isArray(prev[questionId]) ? prev[questionId] : [];
      if (prevArr.includes(choice)) {
        return { ...prev, [questionId]: prevArr.filter(c => c !== choice) };
      } else {
        return { ...prev, [questionId]: [...prevArr, choice] };
      }
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitStatus(null);
    axios.post(`${API_BASE_URL}form/${code}/submit/`, { responses })
      .then(res => {
        setSubmitStatus('success');
      })
      .catch(err => {
        setSubmitStatus('error');
      });
  };

  if (loading) return <div className="flex justify-center items-center h-screen">Loading...</div>;
  if (error) return <div className="flex justify-center items-center h-screen text-red-500">{error}</div>;
  if (!form) return null;

  return (
    <div style={{ backgroundColor: form.background_color || '#f3f4f6' }} className="min-h-screen font-[Verdana] py-10 flex justify-center">
      <div className="flex flex-col gap-6 w-full mx-auto max-w-2xl">
        {/* Form Header */}
        <div className="bg-white shadow-md rounded-xl p-6 border-t-8 border-blue-500 mb-4">
          <h1 className="w-full text-3xl font-bold text-gray-800 mb-2">{form.title || 'Untitled Form'}</h1>
          <p className="w-full text-base text-gray-600 mb-2">{form.description}</p>
        </div>
        {/* Questions */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          {form.questions && form.questions.length > 0 ? (
            form.questions.map((q, idx) => (
              <div key={q.id} className="bg-white shadow-md rounded-xl p-4 border-l-4 border-blue-500">
                <label className="block text-lg font-medium text-gray-700 mb-2">
                  {idx + 1}. {q.question}
                  {q.is_required && <span className="text-red-500 ml-1">*</span>}
                </label>
                <div className="mt-2">
                  {q.question_type === 'short answer' && (
                    <input
                      type="text"
                      className="border-b border-gray-300 focus:outline-none focus:border-blue-500 w-full px-2 py-1"
                      value={responses[q.id] || ''}
                      onChange={e => handleChange(q.id, e.target.value)}
                      required={q.is_required}
                      placeholder="Short answer text"
                    />
                  )}
                  {q.question_type === 'long answer' && (
                    <textarea
                      className="border-b border-gray-300 focus:outline-none focus:border-blue-500 w-full px-2 py-1"
                      value={responses[q.id] || ''}
                      onChange={e => handleChange(q.id, e.target.value)}
                      required={q.is_required}
                      placeholder="Long answer text"
                    />
                  )}
                  {q.question_type === 'multiple choice' && q.choices && (
                    <div className="flex flex-col gap-2 mt-1">
                      {q.choices.map(opt => (
                        <label key={opt.id} className="flex items-center gap-2">
                          <input
                            type="radio"
                            name={`question_${q.uid}`}
                            value={opt.choice}
                            checked={responses[q.id] === opt.choice}
                            onChange={() => handleChange(q.id, opt.choice)}
                            required={q.is_required}
                            className="accent-blue-600"
                          />
                          <span className="ml-1">{opt.choice}</span>
                        </label>
                      ))}
                    </div>
                  )}
                  {q.question_type === 'checkbox' && q.choices && (
                    <div className="flex flex-col gap-2 mt-1">
                      {q.choices.map(opt => (
                        <label key={opt.choice} className="flex items-center gap-2">
                          <input
                            type="checkbox"
                            name={`question_${q.id}`}
                            value={opt.choice}
                            checked={Array.isArray(responses[q.id]) && responses[q.id].includes(opt.choice)}
                            onChange={() => handleCheckboxChange(q.id, opt.choice)}
                            className="accent-blue-600"
                          />
                          <span className="ml-1">{opt.choice}</span>
                        </label>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))
          ) : (
            <div className="text-gray-500">No questions in this form.</div>
          )}
          <button
            type="submit"
            className="mt-2 px-6 py-3 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700 transition"
            disabled={submitStatus === 'success'}
          >
            {submitStatus === 'success' ? 'Submitted!' : 'Submit'}
          </button>
          {submitStatus === 'error' && (
            <div className="text-red-500 mt-2">Failed to submit. Please try again.</div>
          )}
        </form>
      </div>
    </div>
  );
}

export default Form; 