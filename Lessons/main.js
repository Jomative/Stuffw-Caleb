const menuCont = document.getElementById("menuCont");
const button = document.getElementById("button");

let labelList = ["File","Save","Settings", "About","Logout"];
let labelList2 = ["a","b","c"];

function createDropdown(btn,getList,listF,onView,onclick){
    btn.onclick = function(){
        if(menuCont.children.length >= 1){
            menuCont.innerHTML = "";
            menuCont.style.pointerEvents = "none";
            return;
        }
        let rect = btn.getBoundingClientRect();
        let dropdown = document.createElement("dropdown");
        dropdown.className = "dropdown";
        menuCont.appendChild(dropdown);
        menuCont.style.pointerEvents = "initial";
        menuCont.style.left = rect.x+"px";
        menuCont.style.top = (rect.y+rect.height)+"px";

        //loop through list
        let list = getList();
        for(let i = 0; i < list.length; i++){
            let label = list[i];
            let labelDiv = document.createElement("div");

            labelDiv.textContent = label;
            onView(labelDiv,i);
            labelDiv.onclick = function(e){
                listF[i];
                alert(e.x);
                
            }
            
            dropdown.appendChild(labelDiv);
        }
    };
}

createDropdown(button,()=>{
    return labelList.concat(labelList2);
},[
    function(e){
        alert("1: "+e.clientX);
    },
    function(e){
        alert("2");
    },
    function(e){
        alert("3");
        
    },
    function(e){
        alert("Just a dropdown menu");
    }
],(div,i)=>{
    if(i == 2){
        div.style.backgroundColor = "red";
    }
});

function waitForSeconds(time){
    return new Promise(resolve=>{
        setTimeout(()=>{
            resolve();
        },time);
    });
}
async function countDown(){
    let out = [3,2,1,"GO!"];
    for(let i = 0; i < out.length; i++){
        await waitForSeconds(2000);
        console.log(out[i]);
        /*setTimeout(function(){
            console.log(out[i]);
        },(i+1)*1000);*/
    }
    /*console.log(3);
    setTimeout(()=>{
        console.log(2);
        setTimeout(()=>{
            console.log(1);
            setTimeout(()=>{
                console.log("GO!");
            },1000);
        },500);
    },500);*/
}
countDown();