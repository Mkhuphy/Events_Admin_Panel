import React, { useEffect, useState } from 'react';
import { collection, collectionGroup, doc, getDoc, getDocs} from "firebase/firestore";
import '../pages/style.css';
import 'flowbite';
import { auth, db, getProfile, logout } from './Firebase';
import { useNavigate } from 'react-router-dom';
import { useAuthState } from 'react-firebase-hooks/auth';
import items from "../json/allSports.json"
import fields from "../json/fields.json"

const Home = () => {
  

  var [allKeys, setAllKeys] = useState([])
  const [allSports, setAllSports] = useState([])
  useEffect(() => {
    const arr1 = []
    items.map(e => {
      arr1.push(e)
    })
    setAllSports(arr1)
    // console.log(allSports)
  },[])
  const [allFields, setAllFields] = useState([])
  useEffect(() => {
    const arr1 = []
    fields.map(e => {
      arr1.push(e)
    })
    setAllFields(arr1)
    
    // console.log(allSports)
  },[])
  allKeys = allKeys.concat(allFields,allSports)
  


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
  const [arrLarge,setArrLarge] = useState([])


  var global_data = []
  var global_data_Large = []

  var dict = {}
  var i=0;
  
  async function createDict(doc){
    var key = "";
    // items.map
    for(var len = 0; len < allFields.length ; len++) {
      key = allFields[len];
      // console.log(key);
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
    createArray(dict,doc)  //1
  }





  function createArray(dict,doc){
    var temp_arr = [];

    for(var len = 0; len < allFields.length ; len++) {
      temp_arr.push('"'+dict[allFields[len]][i]+'"');
      
    }
    
    i=i+1;
    // console.log(i);
    // console.log(temp_arr+"Temp_ARR");
    global_data.push(temp_arr);
    
    addSportsInTemp(temp_arr,doc)

  }

  async function addSportsInTemp(temp_arr,document){

    const teamCount = new Map();
    const docRef = collection(db, "People",document.id,"sports");
    const docSnap = await getDocs(docRef);
      
      // hideFunction(form.name.value);
      // console.log(typeof(docSnap))
      docSnap.forEach(dox => {
        // console.log(doc.data());
        const sp = dox.data()["sport"]
        teamCount.set(sp,dox.data()["team"].length)
        
        // teamCount.set(,);

      });
      
      for(var len = 0; len < allSports.length ; len++) {
        if(teamCount.get(allSports[len])==undefined){
          temp_arr.push("")
        }
        else{
          temp_arr.push(teamCount.get(allSports[len]))
        }

      }
      
    global_data_Large.push(temp_arr);
      
  }

// create element & render cafe

  function createCSV_1(){
    
    var temp_arr = [];
    for(var len = 0; len < allKeys.length ; len++) {
      temp_arr.push('"'+allKeys[len]+'"');
    }
    global_data_Large.push(temp_arr);
    temp_arr=[]
    for(var len = 0; len < allKeys.length ; len++) {
      temp_arr.push('');
    }
    global_data_Large.push(temp_arr);
  }

  async function  we (){
      // console.log("FN called");
      // for(var len = 0; len < allSports.length ; len++) {
      //   temp_arr.push('"'+allFields[len]+'"');
      // }
      createCSV_1();

      const docRef = collection(db, "People");
      const docSnap = await getDocs(docRef);
      
      // hideFunction(form.name.value);
      // console.log(typeof(docSnap))
      docSnap.forEach(doc => {
        // console.log(doc.data());
        
        createDict(doc);

      });
      setArr(global_data);
      setArrLarge(global_data_Large);
      console.log(arrLarge);
      
      
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
// 
  function save(){
      console.log("f2");
      var csvContent = '';
      
      arrLarge.forEach(function(infoArray, index) {
          var dataString = infoArray.join(',');
          csvContent += index < arrLarge.length ? dataString + '\n' : dataString;
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
          <button onClick={save}>Download All</button>
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

                  <th>Alt Phone Number</th>
                  <th>City</th>
                  <th>College Address</th>
                  <th>Contingent</th>
                  <th>Gender</th>
                  <th>Position</th>
                  <th>State</th>
                  <th>Whatsapp Number</th>
                  
                </thead>
              <tbody>
          {arr.map((value, index) => {
            
            return (
              <tr  key={index}>
                <td>{index+1}</td>
                <td>{arr[index][5]}</td>
                <td>{arr[index][7]}</td>
                <td>{arr[index][4]}</td>
                <td>{arr[index][8]}</td>   

                <td>{arr[index][0]}</td>        
                <td>{arr[index][1]}</td>        
                <td>{arr[index][2]}</td>        
                <td>{arr[index][3]}</td>        
                <td>{arr[index][6]}</td>        
                <td>{arr[index][10]}</td>        
                <td>{arr[index][11]}</td>        
                <td>{arr[index][12]}</td>        
                
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

