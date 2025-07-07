import React from 'react'


// FormHeader component for Google Forms-like top bar
function FormHeader({ activeTab, onTabChange, formisSaving, code }) {
    return (
      <div className="w-full flex items-center fixed z-[1000]  justify-between px-6 py-3 bg-purple-600 shadow text-white">
        <div className="flex items-center  gap-3">
          {/* Google Forms-like icon */}
          <div className="bg-white rounded-md p-2 flex items-center justify-center">
            <svg width="32" height="32" viewBox="0 0 32 32" fill="none"><rect width="32" height="32" rx="6" fill="#8E24AA"/><rect x="7" y="7" width="18" height="18" rx="2" fill="white"/><rect x="10" y="10" width="12" height="2" rx="1" fill="#8E24AA"/><rect x="10" y="14" width="8" height="2" rx="1" fill="#8E24AA"/><rect x="10" y="18" width="6" height="2" rx="1" fill="#8E24AA"/></svg>
          </div>
          <span className="text-2xl font-bold tracking-tight">Form Builder</span>
        </div>
        {activeTab === 'questions' ? (
          <>
          {formisSaving && <p>Saving form...</p>}
            {!formisSaving && <p>Saved!</p> }
            </> 
          ):(<></>)}
        <div className="flex gap-2 md:gap-6 items-center">
          <button
            className={`px-3 py-1 rounded transition font-medium ${activeTab === 'questions' ? 'bg-white text-purple-700' : 'hover:bg-purple-700/30'}`}
            onClick={() => {window.location.href = `/form/${code}/edit`}}
            
          >
            Questions
          </button>
          <button
            className={`px-3 py-1 rounded transition font-medium ${activeTab === 'responses' ? 'bg-white text-purple-700' : 'hover:bg-purple-700/30'}`}
            onClick={() => {window.location.href = `/form/${code}/response`}}

            
          >
            Responses
          </button>
          <button
            className={`px-3 py-1 rounded transition font-medium ${activeTab === 'settings' ? 'bg-white text-purple-700' : 'hover:bg-purple-700/30'}`}
            onClick={() => {window.location.href = `/form/${code}/edit`}}

            
          >
            Settings
          </button>
          {/* Add more options as needed */}
          <div className="ml-2 flex gap-2">
            <button className="hover:bg-purple-700/30 px-2 py-1 rounded" title="Preview">
              <svg width="20" height="20" fill="none" viewBox="0 0 24 24"><path d="M12 5c-7 0-9 7-9 7s2 7 9 7 9-7 9-7-2-7-9-7zm0 12c-4.418 0-7.364-3.134-8.484-5C4.636 10.134 7.582 7 12 7s7.364 3.134 8.484 5C19.364 13.866 16.418 17 12 17zm0-8a3 3 0 100 6 3 3 0 000-6z" fill="currentColor"/></svg>
            </button>
            <button className="hover:bg-purple-700/30 px-2 py-1 rounded" title="More">
              <svg width="20" height="20" fill="none" viewBox="0 0 24 24"><circle cx="5" cy="12" r="2" fill="currentColor"/><circle cx="12" cy="12" r="2" fill="currentColor"/><circle cx="19" cy="12" r="2" fill="currentColor"/></svg>
            </button>
          </div>
        </div>
      </div>
    );
  }

export default FormHeader;