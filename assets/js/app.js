
var cl=console.log;
const Base_Url="https://xhrcrud-default-rtdb.firebaseio.com"
const Doc_url=`${Base_Url}/document/.json`


const BookContainer=document.getElementById("BookContainer");
const Documents=document.getElementById("Documents")
const isChecked=document.getElementById("isChecked");
const Form=document.getElementById("Form");
const spinner=document.getElementById("spinner")
const AddStatus =document.getElementById("AddStatus")
const UpdateStatus=document.getElementById("UpdateStatus")

// localstorage
 let state={
    BookArrr:[],
    Edit_Id:null,
}


// OBJtoArr
function ObjtoArr(obj) {
    for (const key in obj) {
        obj[key].id = key;
        state.BookArrr.unshift(obj[key]);
    }
}

// / Snakbar
function Snakbar(msg,icon){
    Swal.fire({
        title:msg,
        icon:icon,
        timer:2500,
    
    })
}

spinner
function Handlespinner() {
    spinner.classList.toggle("d-none")
    
}


// Templating
function Rendering(arr){
    let result=``;
    arr.forEach(ele => {
        result+=`
        <li class="list-group-item d-flex justify-content-between"id="${ele.id}">
                                <div>
                                    <input  onclick="TickOncheck(this)"   type="checkbox"${ele.isChecked ? "checked" : ""}>
                                    <strong>${ele.Documents}</strong>
                                </div>
                                <div>
                                    <i onclick="OnEdit(this)" class="fa-solid fa-pen-to-square fa-2x text-primary"></i>
                                    <i onclick="OnDelete(this)" class="fa-solid fa-trash-can fa-2x text-danger"></i>
                                </div>
                            </li>`
        
    });
    BookContainer.innerHTML=result;
}



// read

async function OnShow(){
    try{
            Handlespinner();

            let res= await fetch(Doc_url,{
                method:"GET",
                body:null,
                headers:{
                    "content-Type":"application/json",
            "Authorization":"TOKEN JWT FROM  LS"
        
                }

            });
            let data= await res.json();
            cl(data);
            ObjtoArr(data);
            Rendering(state.BookArrr)

    }catch (err){
        cl(err)
    }finally{
        Handlespinner();
    }

}
OnShow();


// create

async function OnCreateHandler(eve){
    eve.preventDefault();
    try {
            Handlespinner();
        let NewObj={
        Documents:Documents.value,
    isChecked: isChecked.value === "yes" ? true : false
        }
        cl("New Object:", NewObj);

        let res= await fetch(Doc_url,{
            method:"POST",
            body:JSON.stringify(NewObj),
            headers:{
                "content-Type":"application/json",
            "Authorization":"TOKEN JWT FROM  LS"
        
            }

        });
        let data= await res.json();
        let li=document.createElement("li");
        NewObj.id = data.name;
        state.BookArrr.unshift(NewObj);

        li.id = NewObj.id;


        li.className="list-group-item d-flex justify-content-between"
        li.innerHTML=` <div>
                                    <input onclick="TickOncheck(this)" type="checkbox"${NewObj.isChecked ? " checked " : ""}>
                                    <strong>${NewObj.Documents}</strong>
                                </div>
                                <div>
                                    <i onclick="OnEdit(this)" class="fa-solid fa-pen-to-square fa-2x text-primary"></i>
                                    <i onclick="OnDelete(this)" class="fa-solid fa-trash-can fa-2x text-danger"></i>
                                </div> `
                                BookContainer.prepend(li);
                                Snakbar("Documents Added","success");
                                Form.reset();
    }catch (err){
    cl(err)

}finally{
    Handlespinner();
}

}


// Edit
function OnEdit(eve){
    let Edit_id=eve.closest("li").id;
state.Edit_Id = Edit_id;    
let Edit_obj=state.BookArrr.find(t =>t.id===Edit_id);
    Documents.value=Edit_obj.Documents,
isChecked.value = Edit_obj.isChecked ? "yes" : "no";
    AddStatus.classList.add("d-none")
    UpdateStatus.classList.remove("d-none")
}


// update
async function Btnandler(para) {
    Handlespinner();
    let Update_id=state.Edit_Id;
    let upobj={
        Documents:Documents.value,
    isChecked: isChecked.value === "yes" ? true : false,
        id:Update_id
    }
    let update_url=`${Base_Url}/document/${Update_id}.json`
    try{
        let res= await fetch(update_url,{
            method:"PATCH",
            body:JSON.stringify(upobj),
            headers:{"content-Type":"application/json",
                "Authorization":"TOKEN JWT FROM  LS"
        }
        });
        let data= await res.json();
        let index=state.BookArrr.findIndex(t=>t.id===Update_id)
        state.BookArrr[index]=upobj
        let li=document.getElementById(Update_id);
        li.innerHTML=`<div>
                                    <input onclick="TickOncheck(this)" type="checkbox"${upobj.isChecked ? " checked " : ""}>
                                    <strong>${upobj.Documents}</strong>
                                </div>
                                <div>
                                    <i onclick="OnEdit(this)" class="fa-solid fa-pen-to-square fa-2x text-primary"></i>
                                    <i onclick="OnDelete(this)" class="fa-solid fa-trash-can fa-2x text-danger"></i>
                                </div> `
                                AddStatus.classList.remove("d-none")
                            UpdateStatus.classList.add("d-none")
                            Snakbar("Documents Updated","success")
                            Form.reset();


                       
        
    }catch(err){
        cl(err)
    }finally{
        Handlespinner();
    }
    
}

// delete

async function OnDelete(eve){
    let Remove_id=eve.closest("li").id;
    let result =await Swal.fire({
  title: "Are you sure?",
  text: "You won't be able to revert this!",
  icon: "warning",
  showCancelButton: true,
  confirmButtonColor: "#3085d6",
  cancelButtonColor: "#d33",
  confirmButtonText: "Yes, delete it!"
});
  if (result.isConfirmed){
        Handlespinner();

    try{
            let Remove_url=`${Base_Url}/document/${Remove_id}.json`;
            let res= await fetch(Remove_url,{
                method:"DELETE",
                body:null,
                headers:{
                    "content-Type":"application/json",
                    "Authorization":"TOKEN JWT FROM  LS"
        
                }

            });
            let data= await res.json();
            let index=state.BookArrr.findIndex(b => b.id===Remove_id)
            state.BookArrr.splice(index,1);
            eve.closest("li").remove()
        Snakbar("Item Removed!","success")

    }catch (err){
        cl(err)
    }finally{    
        Handlespinner();

        
    }
  }
}


// function for checkbox
async function TickOncheck(eve){
    Handlespinner();
    try{
            let DocId= eve.closest("li").id;
            let isChecked=eve.checked
            let New_url=`${Base_Url}/document/${DocId}.json`
            let res= await fetch(New_url,{
                method:"PATCH",
                body:JSON.stringify({isChecked:isChecked}),
                headers:{
                    "content-Type":"application/json",
            "Authorization":"TOKEN JWT FROM  LS"
        
                }
            });
            let data= await res.json();
            let Localobj=state.BookArrr.find(t=>t.id===DocId);
                    Localobj.isChecked=isChecked;




    }catch (err){
        cl(err)
    }finally{
        Handlespinner();
    }


}

Form.addEventListener("submit",OnCreateHandler)
UpdateStatus.addEventListener("click",Btnandler)