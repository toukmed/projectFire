/**
 * Created by TOUKRICHTE-PC.
 */
(() => {
    // Initialize Firebase
    var config = {
        apiKey: "AIzaSyBCjzAg4b6K_FJ1ESuRS9Iwzehqqp9sTBI",
        authDomain: "fir-mailing.firebaseapp.com",
        databaseURL: "https://fir-mailing.firebaseio.com",
        storageBucket: "fir-mailing.appspot.com",
        messagingSenderId: "719788782852"
    };
    firebase.initializeApp(config);

    // Get DOM elements
    let mainScreen = document.querySelector("#mainScreen");
    let ulList = document.querySelector("#mainScreen>#list");
    let buttonAdd = document.querySelector("#send");
    let buttonRemove = document.querySelector("#remove");
    let buttonCheckAll = document.querySelector("#checkAllMsg");
    let buttonControlPanel = document.querySelector("#controlPanelBtn");
    let alerts = document.querySelector("#alerts");
    let infos = document.querySelector("#infos");
    let objet = document.querySelector("#objet");
    let corps = document.querySelector("#corps");

    // Get database reference
    let dbRef = firebase.database().ref().child("messages");

    dbRef.on('value', snap => {
    });

    // When a child added we call this method
    // This method display the list of all messages
    // And display the number of messages by calling (getNbrMsg)
  //  <li><div class="item in">
    //    <div class="image">
      //  <img src="assets/images/users/user2.jpg" alt="John Doe">
       // </div>
        //<div class="text">
        //<div class="heading">
        //<a href="#">John Doe</a>
    //<span class="date">08:33</span>
    //</div>
   // Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed facilisis suscipit eros vitae iaculis.
   // </div>
   // </div></li><

    dbRef.on('child_added', snap => {
        const h5 = document.createElement('h5');
        const input = document.createElement('input');

        const li = document.createElement('li');
        const divitem = document.createElement('div');
        divitem.classList.add('item');
        const divtext = document.createElement('div');
        divtext.classList.add('text');
        const divheading = document.createElement('div');
        divheading.classList.add('heading');
        const a = document.createElement('a');
        const span = document.createElement('span');
        span.classList.add('date');
        input.type = "checkbox";
        divheading.innerHTML = snap.val().corps;
        a.innerHTML=snap.val().objet;
        li.id = snap.key;
        ulList.appendChild(li);
        li.appendChild(span);
        li.appendChild(h5);
        getNbrMsg();
    });

    // Here we are listen to remove event, this method remove the DOM child from the screen
    dbRef.on('child_removed', snap => {
        let liToRemove = document.getElementById(snap.key);
        liToRemove.remove();
        console.log(liToRemove.id);
        getNbrMsg();
    });

    function  addMessage () {
        let msg = {
            "objet" : objet.value, "corps" : corps.value
        };

        if (msg.objet == "" || msg.corps == "")
            showAlert("Error ! All fields are required", "alert-danger");
        else {
            dbRef.push().set(msg);
            objet.value = "";
            corps.value = "";
            showAlert("Success. Your message has been added", "alert-success");
        }
    }

    function removeMessage () {
        let allInputs = Array.from(document.querySelectorAll('#list>li>input'));
        let rowsToRemoveExist = false;
        for (let i = 0; i < allInputs.length; i++)
            if (allInputs[i].checked) {
                dbRef.child(allInputs[i].parentElement.id).remove();
                rowsToRemoveExist = true;
                showAlert("The message has been suppressed", "alert-success");
            }

            if (!rowsToRemoveExist)
                showAlert("Error ! We can not delete messages please select one", "alert-danger");

    }


    function checkAllOrNot () {
        let allInputs = Array.from(document.querySelectorAll('#list>li>input'));

        if (buttonCheckAll.textContent == "Check all") {
            buttonCheckAll.textContent = "Do not check all";
            for (let i = 0; i < allInputs.length; i++)
                allInputs[i].checked = true;
        }

        else {
            buttonCheckAll.textContent = "Check all";
            for (let i = 0; i < allInputs.length; i++)
                allInputs[i].checked = false;
        }
    }

    function showControlePanel () {
        let controlpanel = document.querySelector("#form");
        if (controlpanel.style.top == "0px")
            controlpanel.style.top = "-270px";

        else
            controlpanel.style.top = "0px";
    }


    function showAlert(msg, type) {
        let div = document.createElement('div');
        div.classList.add('alert', type);
        div.textContent = msg;
        alerts.appendChild(div);
        setTimeout(() => {
            div.parentElement.removeChild(div);
        }, 2000)
    }


    function getNbrMsg () {
        dbRef.once("value", snap => {
            let nbrMsg = snap.numChildren();
            infos.textContent = "You have ".concat(nbrMsg + " messages");
        });
    }

    // Here we call our functions when the user click at buttons
    buttonAdd.onclick = addMessage;
    buttonRemove.onclick = removeMessage;
    buttonCheckAll.onclick = checkAllOrNot;
    buttonControlPanel.onclick = showControlePanel;
})();



