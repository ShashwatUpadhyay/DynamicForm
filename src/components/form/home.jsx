import React , {useEffect , useState} from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { API_BASE_URL } from "/config";
import Swal from 'sweetalert2'

function Home() {
    const [FormList , setFormList] = useState([]);
    const token = localStorage.getItem("authToken");


  const navigate = useNavigate();

  const  deleteForm = (code) => {
      Swal.fire({
        title: "Do you want delete the form?",
        showCancelButton: true,
        confirmButtonText: "Yes"
      }).then((result) => {
        /* Read more about isConfirmed, isDenied below */
        if (result.isConfirmed) {
          Swal.fire("Saved!", "", "success");
          console.log("confiremed");
          axios.delete(`${API_BASE_URL}form/?code=${code}`,{ 
            headers: {
              Authorization: `Token ${token}`,
            },
          },).then((res) => {
              if (res.data.status === true){
                Swal.fire(res.data.message, "", "success");
                setFormList(prev => prev.filter(f => f.code !== code));
              }
          })
        } else{
          Swal.fire(res.data.message, "", "info");
          console.log("cancel");
        }
      });
  };


  const handleNewForm = () => {
    try {
        axios.post(API_BASE_URL + "form/",{},{ 
          headers: {
            Authorization: `Token ${token}`,
          },
        }    
      ).then((res) => {
            console.log(res.data);
            if (res.data.status == true){
                console.log("success")
                window.location.href = `/form/${res.data.data.code}/edit`;
            }
        })
        }catch(e){
            console.log(e)
        }

  };

 

  useEffect(() => {
    try {
      axios.get(API_BASE_URL + "forms/",{ 
        headers: {
          Authorization: `Token ${token}`,
        },
      }    
     ).then((res) => {
        setFormList(res.data.data);
      },[]);
        } catch (error) {
        console.log("While creating new form : ", error);
        }
    },[])  

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-2xl">
        <div className='space-between'>
        <span className="text-4xl font-bold text-center mb-8 text-blue-600">My Forms</span>
          <button
            onClick={handleNewForm}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg shadow hover:bg-blue-700 transition float-end"
          >
            + New Form
          </button>
          </div>
        <div className="flex justify-center mb-8">
        </div>
        <div className="bg-white rounded-xl shadow p-6">
          {FormList && FormList.length > 0 ? (
  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
    {FormList.map((form, index) => (
      <div
                key={index}
                className="bg-white p-4 rounded-2xl shadow-md border hover:shadow-lg transition cursor-pointer"
            >
            <a href={`/form/${form.code}/edit`}>
                <h3 className="text-lg font-semibold text-gray-800 mb-2 truncate">
                {form.title || "Untitled Form"}
                </h3>
                <p className="text-sm text-gray-500">Last edited: {new Date(form.updated_at).toLocaleString()}</p>
            </a>
            <button onClick={() => {deleteForm(form.code)}} className="btn text-sm text-red-500">delete</button>
            </div>
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