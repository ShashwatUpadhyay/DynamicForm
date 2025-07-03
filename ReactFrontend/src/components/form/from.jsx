import React, { useState, useEffect } from 'react'
import { Link, useParams } from "react-router-dom";
import { API_BASE_URL } from "/config";
import axios from 'axios';


const QUESTION_TYPES = [
  { value: 'multiple choice', label: 'Multiple choice' },
  { value: 'checkbox', label: 'Checkboxes' },
  { value: 'short answer', label: 'Short Answer' },
  { value: 'long answer', label: 'Long Answer' },
];

function Form() {
    const { code } = useParams();
    const [FormData, setFormData] = useState([]);
    const [formTitle, setFormTitle] = useState()
    const [formDescription, setFormDescription] = useState('Form description');
    const [questions, setQuestions] = useState([]);
    // const [questions, setQuestions] = useState([
    //     {
    //     id: Date.now(),
    //     text: '',
    //     type: 'multiple',
    //     options: ['Option 1'],
    //     required: false,
    //     },
    // ]);

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
        console.log(qid, field, value);
        setQuestions(
            questions.map((q) =>
                q.id === qid ? { ...q, [field]: value } : q
            )
        );
        var data = {};
        if (field === 'question_type') {
            data = {
                question_id : qid,
                question_type : value
            } 
        }else if(field === 'question'){
            data = {
                question_id : qid,
                question : value
            } 
        }else if(field === 'is_required'){
            data = {
                question_id : qid,
                is_required : value
            } 
        }
        console.log(data)
        axios.patch(API_BASE_URL + 'question/',data).then((res) => {
            console.log(res.data);
            
        }).catch((err) => {
            console.log(err)
        })
        
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

    const addOption = ( fid, qid) => {
        axios.post(API_BASE_URL + `choice/`,{
            "form_id" : fid,
            "question_id" : qid
        }).then((res) => {
            if (res.data.status === true){
                const newChoice = res.data.data;
                setQuestions(
                    questions.map((q) =>
                        q.id === qid
                        ? { ...q, choices: [...(q.choices || []), newChoice]}
                        : q
                    )
                    );
                }})
        .catch((err) => {
            console.error("Error:", err);
        })
    };

    const removeOption = (uid) => {
        axios.delete(API_BASE_URL + `choice/`,{
            data: {
                option_uid: uid
              }
        }).then((res) => {
            if (res.data.status === true){
                document.getElementById(`${uid}`).remove();
            }
        })
        .catch((err) => {
            console.error("Error:", err);
        })
    };

    useEffect(() => {
        try {
            axios.get(API_BASE_URL + "form" + `?code=${code}`)
              .then((res) => {                
                if (res.data.status == 'success') {
                    setFormData(res.data.data);
                    setFormTitle(res.data.data.title);
                    setFormDescription(res.data.data.description);
                    setQuestions(res.data.data.questions);
                }
            }, []);
        } catch (error) {
            console.log(error);
        }
    },[]);

  return (
    <div style={{ backgroundColor: FormData.background_color }} className='justify-center w-full-screen py-10'>
      <div className="flex flex-col gap-6 w-full mx-auto max-w-2xl">
        {/* Form Header */}
        <div className="bg-white shadow-md rounded-xl p-6 border-t-8 border-blue-500 mb-4">
          <input
            onChange={e => setFormTitle(e.target.value)}
            type="text"
            value={formTitle}
            className="w-full text-3xl font-bold text-gray-800 border-none focus:outline-none mb-2"
            placeholder="Untitled Form"
          />
          <textarea
            onChange={e => setFormDescription(e.target.value)}
            className="w-full text-base text-gray-600 border-none focus:outline-none resize-none"
            placeholder="Form description"
            rows={2}
            value={formDescription}
          >{formDescription}</textarea>
        </div>
        {/* Questions */}
        {questions.map((q, qIdx) => (
          <div key={q.id} className="bg-white shadow-md rounded-xl p-4 border-l-4 border-blue-500">
            <div className="flex items-start justify-between gap-4 mx-auto">
              <input
                type="text"
                value={q.question}
                placeholder="Untitled Question"
                onChange={e => updateQuestion(q.id, 'question', e.target.value)}
                className="w-full text-lg font-medium border-b border-gray-300  focus:outline-none focus:border-blue-500"
              />
              <select
                value={q.question_type} 
                onChange={e => updateQuestion(q.id, 'question_type', e.target.value)}
                className="border rounded p-1 text-sm text-gray-700"
              >
                {QUESTION_TYPES.map(opt => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
              
            </div>
            <div className="mt-4">
              {q.question_type === 'short answer' && (
                <input
                  type="text"
                  placeholder="Short answer text"
                  disabled
                  className="border-b border-gray-300 focus:outline-none focus:border-blue-500 w-full"
                />
              )}
              {q.question_type === 'long answer' && (
                <textarea
                  placeholder="Long answer text"
                  disabled
                  className="border-b border-gray-300 focus:outline-none focus:border-blue-500 w-full"
                />
              )}
              {(q.question_type === 'multiple choice' || q.question_type === 'checkbox') && (
                <div className="flex flex-col gap-2">
                  {q.choices.map((opt, idx) => (
                    <div id={opt.uid}  key={idx} className="flex items-center gap-2">
                      <input
                        type={q.question_type === 'multiple choice' ? 'radio' : 'checkbox'}
                        name={`${q.id}`}
                        disabled
                      />
                      <input
                        type="text"
                        value={opt.choice}
                        onChange={e => updateOption(q.id, idx, e.target.value)}
                        className="border-b border-gray-300 focus:outline-none focus:border-blue-500 w-full"
                      />
                      {q.choices.length > 1 && (
                        <button type="button" onClick={() => removeOption(opt.uid, idx)} title="Remove option">
                          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 50 50"><path d="M 7.71875 6.28125 L 6.28125 7.71875 L 23.5625 25 L 6.28125 42.28125 L 7.71875 43.71875 L 25 26.4375 L 42.28125 43.71875 L 43.71875 42.28125 L 26.4375 25 L 43.71875 7.71875 L 42.28125 6.28125 L 25 23.5625 Z"></path></svg>
                        </button>
                      )}
                    </div>
                  ))}
                  <div className="text-sm text-gray-600 mt-2">
                    <button
                      type="button"
                      onClick={() => addOption(FormData.id ,q.id )}
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
                  onChange={e => updateQuestion(q.id, 'is_required', e.target.checked)}
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
