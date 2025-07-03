import React , {useEffect , useState} from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { API_BASE_URL } from "/config";

function Home() {
    const [FormList , setFormList] = useState([]);

  const navigate = useNavigate();

  const handleNewForm = () => {
    navigate('/form');
  };

  useEffect(() => {
    try {
      axios.get(API_BASE_URL + "forms/" ).then((res) => {
        setFormList(res.data.data);
        console.log(res.data.data);
        console.log(FormList);
      },[]);
        } catch (error) {
        console.log(error);
        }
    },[])  

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-2xl mt-20">
        <h1 className="text-4xl font-bold text-center mb-8 text-blue-600">Google Forms Clone</h1>
        <div className="flex justify-center mb-8">
          <button
            onClick={handleNewForm}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg shadow hover:bg-blue-700 transition"
          >
            + New Form
          </button>
        </div>
        <div className="bg-white rounded-xl shadow p-6">
          <h2 className="text-2xl font-semibold mb-4">Your Forms</h2>
          {FormList && FormList.length > 0 ? (
  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
    {FormList.map((form, index) => (
        <a href={`/form/${form.code}`}>
            <div
                key={index}
                className="bg-white p-4 rounded-2xl shadow-md border hover:shadow-lg transition cursor-pointer"
            >
                <h3 className="text-lg font-semibold text-gray-800 mb-2 truncate">
                {form.title || "Untitled Form"}
                </h3>
                <p className="text-sm text-gray-500">Last edited: {new Date(form.updated_at).toLocaleString()}</p>
            </div>
            </a>
            ))}
        </div>
        ) : (
        <div className="text-gray-500 text-center py-8">
            No forms yet. Click <span className="font-semibold">"New Form"</span> to create one!
        </div>
        )}
        </div>
        </div>
        </div>
  );
}

export default Home; 