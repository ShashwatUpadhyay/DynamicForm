import React, { useState, useEffect } from 'react'
import { Link, useParams } from "react-router-dom";
import { API_BASE_URL } from "/config";
import axios from 'axios';


const QUESTION_TYPES = [
  { value: 'multiple', label: 'Multiple choice' },
  { value: 'checkbox', label: 'Checkboxes' },
  { value: 'short', label: 'Short Answer' },
  { value: 'long', label: 'Long Answer' },
];

function Form() {
    const { code } = useParams();
    console.log(code);
    const [formTitle, setFormTitle] = useState('Untitled Form');
    const [FormData, setFormData] = useState([]);
    const [formDescription, setFormDescription] = useState('Form description');
    const [questions, setQuestions] = useState([
        {
        id: Date.now(),
        text: '',
        type: 'multiple',
        options: ['Option 1'],
        required: false,
        },
    ]);

    const addQuestion = () => {
        setQuestions([
        ...questions,
        {
            id: Date.now() + Math.random(),
            text: '',
            type: 'multiple',
            options: ['Option 1'],
            required: false,
        },
        ]);
    };

    const removeQuestion = (qid) => {
        setQuestions(questions.filter((q) => q.id !== qid));
    };

    const updateQuestion = (qid, field, value) => {
        setQuestions(
        questions.map((q) =>
            q.id === qid ? { ...q, [field]: value } : q
        )
        );
    };

    const updateOption = (qid, idx, value) => {
        setQuestions(
        questions.map((q) => {
            if (q.id !== qid) return q;
            const newOptions = [...q.options];
            newOptions[idx] = value;
            return { ...q, options: newOptions };
        })
        );
    };

    const addOption = (qid) => {
        setQuestions(
        questions.map((q) =>
            q.id === qid
            ? { ...q, options: [...q.options, `Option ${q.options.length + 1}`] }
            : q
        )
        );
    };

    const removeOption = (qid, idx) => {
        setQuestions(
        questions.map((q) => {
            if (q.id !== qid) return q;
            return { ...q, options: q.options.filter((_, i) => i !== idx) };
        })
        );
    };

    useEffect(() => {
        try {
            axios.get(API_BASE_URL + "form" + `?code=${code}`)
              .then((res) => {
                console.log(res.data.data);
                
                if (res.data.status == 'success') {
                    console.log("success");
                    setFormData(res.data.data);
                }
              }, []);
          } catch (error) {
            console.log(error);
          }
    },[]);

  return (
    <div style={{ backgroundColor: FormData.background_color }} className='justify-center w-full-screen py-10'>
      <div className="flex flex-col gap-6 w-[600px] mx-auto max-w-2xl">
        {/* Form Header */}
        <div className="bg-white shadow-md rounded-xl p-6 border-t-8 border-blue-500 mb-4">
          <input
            type="text"
            value={FormData.title}
            onChange={e => setFormTitle(e.target.value)}
            className="w-full text-3xl font-bold text-gray-800 border-none focus:outline-none mb-2"
            placeholder="Untitled Form"
          />
          <textarea
            value={FormData.description}
            onChange={e => setFormDescription(e.target.value)}
            className="w-full text-base text-gray-600 border-none focus:outline-none resize-none"
            placeholder="Form description"
            rows={2}
          />
        </div>
        {/* Questions */}
        {questions.map((q, qIdx) => (
          <div key={q.id} className="bg-white shadow-md rounded-xl p-4 border-l-4 border-blue-500">
            <div className="flex items-start justify-between gap-4 mx-auto">
              <input
                type="text"
                placeholder="Untitled Question"
                value={q.text}
                onChange={e => updateQuestion(q.id, 'text', e.target.value)}
                className="w-full text-lg font-medium border-b border-gray-300  focus:outline-none focus:border-blue-500"
              />
              <select
                value={q.type}
                onChange={e => updateQuestion(q.id, 'type', e.target.value)}
                className="border rounded p-1 text-sm text-gray-700"
              >
                {QUESTION_TYPES.map(opt => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
            </div>
            <div className="mt-4">
              {q.type === 'short' && (
                <input
                  type="text"
                  placeholder="Short answer text"
                  disabled
                  className="border-b border-gray-300 focus:outline-none focus:border-blue-500 w-full"
                />
              )}
              {q.type === 'long' && (
                <textarea
                  placeholder="Long answer text"
                  disabled
                  className="border-b border-gray-300 focus:outline-none focus:border-blue-500 w-full"
                />
              )}
              {(q.type === 'multiple' || q.type === 'checkbox') && (
                <div className="flex flex-col gap-2">
                  {q.options.map((opt, idx) => (
                    <div key={idx} className="flex items-center gap-2">
                      <input
                        type={q.type === 'multiple' ? 'radio' : 'checkbox'}
                        name={`q${q.id}`}
                        disabled
                      />
                      <input
                        type="text"
                        value={opt}
                        onChange={e => updateOption(q.id, idx, e.target.value)}
                        className="border-b border-gray-300 focus:outline-none focus:border-blue-500 w-full"
                      />
                      {q.options.length > 1 && (
                        <button type="button" onClick={() => removeOption(q.id, idx)} title="Remove option">
                          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 50 50"><path d="M 7.71875 6.28125 L 6.28125 7.71875 L 23.5625 25 L 6.28125 42.28125 L 7.71875 43.71875 L 25 26.4375 L 42.28125 43.71875 L 43.71875 42.28125 L 26.4375 25 L 43.71875 7.71875 L 42.28125 6.28125 L 25 23.5625 Z"></path></svg>
                        </button>
                      )}
                    </div>
                  ))}
                  <div className="text-sm text-gray-600 mt-2">
                    <button
                      type="button"
                      onClick={() => addOption(q.id)}
                      className="text-blue-600 hover:underline mr-2"
                    >
                      Add option
                    </button>
                    or <span className="text-blue-600 hover:underline cursor-pointer">Add "Other"</span>
                  </div>
                </div>
              )}
            </div>
            <div className="flex items-center justify-between mt-4 border-t pt-2 text-gray-600">
              <div className="flex gap-4">
                <button type="button" title="Duplicate" onClick={addQuestion}>📄</button>
                <button type="button" title="Delete" onClick={() => removeQuestion(q.id)} disabled={questions.length === 1}>🗑️</button>
              </div>
              <label className="flex items-center gap-2">
                Required
                <input
                  type="checkbox"
                  checked={q.required}
                  onChange={e => updateQuestion(q.id, 'required', e.target.checked)}
                  className="accent-blue-600"
                />
              </label>
            </div>
          </div>
        ))}
        <button
          type="button"
          onClick={addQuestion}
          className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          + Add Question
        </button>
      </div>
    </div>
  );
}

export default Form
