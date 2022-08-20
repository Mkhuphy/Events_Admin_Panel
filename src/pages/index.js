import React, { useEffect, useState } from 'react';
import { collection, doc, getDoc, getDocs} from "firebase/firestore";
import '../pages/style.css';
import 'flowbite';
import { auth, db, getProfile, logout } from './Firebase';
import { useNavigate } from 'react-router-dom';
import { useAuthState } from 'react-firebase-hooks/auth';


const Home = () => {

  const navigate = useNavigate();
  const [user, loading, error] = useAuthState(auth);

  useEffect(() => {
    if (loading) {
      return;
    }
    if (user) {
      async function callAsync() {
        const docRef = await getProfile(user.uid);
        // console.log(docRef);
        if(docRef.exists()){
          // console.log(docRef.data())
          const snap = await getDoc(doc(db, "Admins", user.uid));
          const t = snap.data()["verified"];
          // console.log(t);
          if(t==true){
          navigate("/home");
        }
        else{
          navigate("/notv");
        }
        }else{
          console.log("not identified");
          navigate("/details");
        }
      }
      callAsync();

     
    }
  }, [user, loading]);

  function signOut(){
    logout();
    navigate("/");
  }
    // const [values, setValues] = useState([]);

  const [arr,setArr] = useState([])
  var global_data = []
  var dict = {}
  var i=0;
  var keys = [ "name", "college", "email", "phone", "fb", "insta", "linkedin", "twitter", "referred_by"]
  // doc = doc./
  function createDict(doc){
    var key = "";

    for(var len = 0; len < keys.length ; len++) {
      key = keys[len];
      console.log(key);
      var value;
      if(doc.data()[key] == undefined){
        value = ""
      }else{
        value = doc.data()[key]
      }

      if(dict[key] == undefined) {
        dict[key] = []
      }
      // console.log(value);
      dict[key].push(value)
    }
    createArray(dict)
  }

  function createArray(dict){
    var temp_arr = [];

    for(var len = 0; len < keys.length ; len++) {
      temp_arr.push(dict[keys[len]][i]);
    }
    
    i=i+1;
    // console.log(i);
    // console.log(temp_arr+"Temp_ARR");
    global_data.push(temp_arr);
  }

// create element & render cafe

  async function  we (){
      console.log("FN called");

      const docRef = collection(db, "People");
      const docSnap = await getDocs(docRef);
      // hideFunction(form.name.value);
      docSnap.forEach(doc => {
        // console.log(doc.data());
        createDict(doc);
      });
      setArr(global_data);
      console.log(global_data);
      console.log("ARR IS"+arr);
  }
  we();

  function hideFunction() {
    // Declare variables
    // console.log("fn called 0");
    var input, filter, ul, tr, a, i, txtValue;
    input = document.getElementById('name').value;
    filter = input.toUpperCase();
    ul = document.getElementById("myTable"); 
    tr = ul.getElementsByTagName('tr');

    // Loop through all list items, and hide those who don't match the search query
    for (var i = 0; i < tr.length; i++) {
      // a = li[i].getElementsByTagName("a")[0];
      // x = li[i].getel
      for(var j = 0; j<tr[i].childElementCount; j++){
        var temp = (tr[i].childNodes[j].textContent).toString().toUpperCase();
        var pos = temp.indexOf(filter);
        if(pos!=-1){
          tr[i].style.display = "";
          break;
        }
        if(j==(tr[i].childElementCount-1)){
          tr[i].style.display = "none";
        }
      }
    }
  }

  function save(){
      console.log("f2");
      var csvContent = '';
      arr.forEach(function(infoArray, index) {
          var dataString = infoArray.join(',');
          csvContent += index < arr.length ? dataString + '\n' : dataString;
        });

      var download = function(content, fileName, mimeType) {
        var a = document.createElement('a');
        mimeType = mimeType || 'application/octet-stream';

        if (navigator.msSaveBlob) { 
          navigator.msSaveBlob(new Blob([content], {
            type: mimeType
          }), fileName);
        } else if (URL && 'download' in a) { 
          a.href = URL.createObjectURL(new Blob([content], {
            type: mimeType
          }));
          a.setAttribute('download', fileName);
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
        } else {
          window.location.href = 'data:application/octet-stream,' + encodeURIComponent(content); // only this mime type is supported
        }
      }
        
        download(csvContent, 'dowload.csv', 'text/csv;encoding:utf-8');
  }
  return (
    <>
      <div className='body1'>
      <h1 className='h1'>Udghosh Admin</h1>
          <button onClick={save}>Download as Sheet</button>
          <div className="content">

              <form>
                  <input type="text" id="name" placeholder="Enter Query" onInput={hideFunction}/>
                  {/* <input type="text" name="city" placeholder="search college" onchange="we()"> 
                  <button onclick="we()">Search</button>  */}
              </form>
              </div>
          </div>
              <table id="myTable" className='styled-table'>
                <thead>
                  <th>S.No</th>
                  <th>Name</th>
                  <th>College</th>
                  <th>Email</th>
                  <th>Phone</th>
                </thead>
              <tbody>
          {arr.map((value, index) => {
            
            return (
              <tr  key={index}>
                <td>{index+1}</td>
                <td>{arr[index][0]}</td>
                <td>{arr[index][1]}</td>
                <td>{arr[index][2]}</td>
                <td>{arr[index][3]}</td>
              </tr>
          );
          })}
              </tbody>
          </table>
          
          <div className='hover'></div>
          <button onClick={signOut}>Logout</button>            
          </>
      );
      };



export default Home;


// <div class="w-full bg-white rounded-lg border shadow-md dark:bg-gray-800 dark:border-gray-700">
//     <div id="defaultTabContent">            
//             <ul role="list" class="space-y-4 text-gray-500 dark:text-gray-400">
//                 <li class="flex space-x-2">
                    
//                     <svg class="flex-shrink-0 w-4 h-4 text-blue-600 dark:text-blue-500" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"></path></svg>
//                     <span class="font-light leading-tight">Dynamic reports and dashboards</span>
//                 </li>
//                 <li class="flex space-x-2">
                    
//                     <svg class="flex-shrink-0 w-4 h-4 text-blue-600 dark:text-blue-500" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"></path></svg>
//                     <span class="font-light leading-tight">Templates for everyone</span>
//                 </li>
//                 <li class="flex space-x-2">
                    
//                     <svg class="flex-shrink-0 w-4 h-4 text-blue-600 dark:text-blue-500" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"></path></svg>
//                     <span class="font-light leading-tight">Development workflow</span>
//                 </li>
//                 <li class="flex space-x-2">
                    
//                     <svg class="flex-shrink-0 w-4 h-4 text-blue-600 dark:text-blue-500" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"></path></svg>
//                     <span class="font-light leading-tight">Limitless business automation</span>
//                 </li>
//             </ul>
//     </div>
// </div>
