import "./styles/style.scss";

//import moment
import moment from "moment";
moment().format();

// import Chart.JS
import Chart from "chart.js/auto";

//  version of Bootstrap built as ESM (bootstrap.esm.js and bootstrap.esm.min.js)
//  which allows you to use Bootstrap as a module in your browser

// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {
  getFirestore,
  collection,
  doc,
  setDoc,
  getDoc,
  getDocs,
  deleteDoc,
  updateDoc,
  orderBy,
} from "firebase/firestore";

import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyD2x9eOF0QlP_GW7RRN0vPH-9RiTpFR3o4",
  authDomain: "ticket-table.firebaseapp.com",
  projectId: "ticket-table",
  storageBucket: "ticket-table.appspot.com",
  messagingSenderId: "714999952537",
  appId: "1:714999952537:web:dbdb1e306d5563ca467408",
  measurementId: "G-7077X5Y5YP",
};

const secondaryAppConfig = initializeApp(
  {
    apiKey: "AIzaSyC0ml74-SAMEKp37DeSMI8_qLV6SvQoUdo",
    authDomain: "comments-db-d0a5e.firebaseapp.com",
    projectId: "comments-db-d0a5e",
    storageBucket: "comments-db-d0a5e.appspot.com",
    messagingSenderId: "457920984200",
    appId: "1:457920984200:web:754f6660db252458281b3d",
    measurementId: "G-NLJJDYC9YW",
  },
  "secondaryAppConfig"
);

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Cloud Firestore and get a reference to the service
const db = getFirestore(app);
const commsDB = getFirestore(secondaryAppConfig);

// Initialize Firebase Authentication and get a reference to the service
const auth = getAuth(app);

async function ticketRef(auth, db, commsDB) {
  let r = await getDocs(collection(db, "Ticket-table"));
  let commentsDB = await getDocs(collection(commsDB, "Comments-Box"));
  let tableData = document.getElementById("tableData");
  let loginPage = document.getElementById("staticBackdropLoginForm");
  open(loginPage);

  let tickets = [];
  r.forEach((doc) => {
    tickets.push(doc);
  });

  let commentsDbArr = [];
  commentsDB.forEach((comm) => {
    commentsDbArr.push(comm);
  });

  const tableEl = document.getElementById("tableData");

  const create = (tag = "div", options = {}) =>
    Object.assign(document.createElement(tag), options);

  tableEl.append(
    ...tickets.map((ticket, index) => {
      const row = create("tr", { id: `row${index}` });

      row.id = `row${index}`;

      const checkBoxCell = create("td", {
        className: "text-center",
      });
      const checkBoxLabel = create("label");
      const viewTicketCell = create("td", {
        className: "text-center",
        align: "center",
      });
      const viewTicketButton = create("label");

      checkBoxLabel.append(
        create("input", {
          type: "checkbox",
          className: "form-check-input", // You were creating duplicate `ids`
          name: "selected",
          value: ticket.id,
        }),
        create("span", { textContent: ticket.id })
      );

      const cells = [
        "Status",
        "ticketTitle",
        "Priority",
        "Created",
        "fullName",
        "Email",
        "Assignee",
      ].map((field) =>
        create("td", {
          textContent: ticket.data()[field],
          className: "text-center",
        })
      );

      viewTicketButton.append(
        create("input", {
          type: "button",
          className: "viewTicketDetails btn btn-primary",
          id: "viewTicketButton",
          name: "viewTicket",
          value: "View Ticket",
          onclick: function () {
            var myModal = new bootstrap.Modal(
              document.getElementById("ticketButtonDetails")
            );

            let divStatus = document.getElementById("mdlStatus");
            let divTitle = document.getElementById("mdlTitle");
            let divPriority = document.getElementById("mdlPriority");
            let divCreated = document.getElementById("mdlCreated");
            let divName = document.getElementById("mdlName");
            let divEmail = document.getElementById("mdlEmail");
            let divAssignee = document.getElementById("mdlAssignee");

            divStatus.innerText = cells[0].innerText;
            divTitle.innerText = cells[2].innerText;
            divPriority.innerText = cells[3].innerText;
            divCreated.innerText = cells[4].innerText;
            divName.innerText = cells[5].innerText;
            divEmail.innerText = cells[6].innerText;
            divAssignee.innerText = cells[7].innerText;

            myModal.show();
          },
        })
      );

      checkBoxCell.append(checkBoxLabel),
        viewTicketCell.append(viewTicketButton);

      cells.splice(1, 0, checkBoxCell);
      cells.splice(9, 0, viewTicketCell);
      row.append(...cells);
      return row;
    })
  );

  function comments(commsdb) {
    // commsdb.forEach((eachComment) => {
    //   console.log(eachComment.innerText);
    // });
    // Object.values(commsdb).forEach((el) => {
    //   console.log(el.textContent);
    // });
    // const docRef = doc(commsdb, "Comments-Box");
    // let divMdlCommentsBox = document.getElementById("mdlCommentsBox");
    // divMdlCommentsBox.innerText = eachComment;
  }

  comments(commentsDbArr);

  // tableData.innerHTML = tickets
  //   ? tickets
  //       .map((a) => {
  //         return `
  //       <tr>
  //       <td class ="text-center">${a.data().Status}</td>
  //       <td class ="text-center"><input type="checkbox" id="docReference"></td>
  //       <td class ="text-center" >${a.id}</td>
  //       <td class ="text-center">${a.data().Reference}</td>
  //       <td class ="text-center">${a.data().ticketTitle}</td>
  //       <td class ="text-center">${a.data().Priority}</td>
  //       <td class ="text-center">${a.data().Created}</td>
  //       <td class ="text-center">${a.data().Name}</td>
  //       <td class ="text-center">${a.data().Email}</td>
  //       </tr>`;
  //       })
  //       .join("")
  //   : "";
  //<td class ="text-center">${a.data().Reference}</td>

  document.getElementById("submitForm").addEventListener("click", function (e) {
    e.preventDefault();
    const docReferenceInput = document.querySelector("#docReference");

    let r = setDoc(
      doc(db, "Ticket-table/" + Math.random().toString(36).slice(2, 7)),
      {
        Status: document.querySelector("#ticketStatus").value,
        ticketTitle: document.querySelector("#ticketTitle").value,
        Priority: document.querySelector("#priority").value,
        Created: new Date().toLocaleString(),
        fullName: document.querySelector("#fullName").value,
        Email: document.querySelector("#emailAddress").value,
        Assignee: document.querySelector("#Assignee").value,
      },
      orderBy("Created")
    );

    alert("Your form is submitted successfully");
    document.querySelector("#ticketForm").reset();
  });

  let commentsBoxText = document.getElementById("mdlCommentBox");

  document
    .getElementById("submitNewCommentForm")
    .addEventListener("click", function (e) {
      e.preventDefault();

      let rootRef = collection(commsDB, "Comments-Box/");

      let docRef = doc(rootRef, commentsBoxText.value);

      let a = updateDoc(
        doc(docRef, "Comments-Box/" + Math.random().toString(36).slice(2, 7)),
        {
          Comments: document.querySelector("#mdlCommentBox").value,
        },
        orderBy("Created")
      );

      alert("Your form is submitted successfully");
      document.querySelector("#addNewCommentForm").reset();
    });

  let openStatusCounter = tickets.filter(
    (a) => a.data().Status === "Open"
  ).length;

  let inProgressCounter = tickets.filter(
    (a) => a.data().Status === "In Progress"
  ).length;

  let onHoldCounter = tickets.filter(
    (a) => a.data().Status === "On Hold"
  ).length;

  let escalateCounter = tickets.filter(
    (a) => a.data().Status === "Escalate"
  ).length;
  let closedCounter = tickets.filter(
    (a) => a.data().Status === "Closed"
  ).length;

  let highPriorityTickets = tickets.filter(
    (a) => a.data().Priority === "High"
  ).length;

  const openTickets = document.getElementById("openTickets");

  const priorityTickets = document.getElementById("highPriorityTickets");

  openTickets.textContent = openStatusCounter;

  priorityTickets.textContent = highPriorityTickets;

  const data = {
    labels: ["Open", "In Progress", "On Hold", "Escalate", "Closed"],
    datasets: [
      {
        label: "My First Dataset",
        data: [
          openStatusCounter,
          inProgressCounter,
          onHoldCounter,
          escalateCounter,
          closedCounter,
        ],
        backgroundColor: [
          "rgb(0, 255, 0)",
          "rgb(255, 255, 0)",
          "rgb(255, 153, 51)",
          "rgb(102, 204, 255)",
          "rgb(255, 0, 0)",
        ],
        hoverOffset: 4,
      },
    ],
  };

  let ctx = document.getElementById("myChart");
  const config = new Chart(ctx, {
    type: "pie",
    data: data,
    options: {
      responsive: true,
      maintainAspectRatio: false,
      legend: {
        position: "top",
      },
      title: {
        display: true,
        text: "Ticket Count",
      },
    },
  });

  const deleteTicketEntry = document.querySelector("#reference");
  let delBtn = document.querySelector("#delBtn");

  delBtn.addEventListener("click", async (e) => {
    e.preventDefault();

    //query the database for the ticket id
    let r = await getDoc(doc(db, "Ticket-table/", deleteTicketEntry.value));
    //get root reference
    let rootRef = collection(db, "Ticket-table");
    // get a reference to the document
    let docRef = doc(rootRef, deleteTicketEntry.value);

    //delete the document
    deleteDoc(docRef)
      .then(() => {
        alert("The document has been deleted successfully");
      })
      .catch(() => {
        alert("Unsuccessful operation: " + error);
      });
  });

  const updateTicketForm = document.getElementById("updtticketForm");
  const updateTicketReference = document.querySelector("#updtTktReference");

  document.getElementById("updtBtn").addEventListener("click", function (e) {
    e.preventDefault();

    //get root reference
    let rootRef = collection(db, "Ticket-table/");
    // get a reference to the document
    let docRef = doc(rootRef, updateTicketReference.value);

    //update the document
    updateDoc(docRef, {
      Status: document.querySelector("#updtTktStatus").value,
      ticketTitle: document.querySelector("#updtTicketTitle").value,
      Priority: document.querySelector("#updtTicketPriority").value,
      Name: document.querySelector("#updtTicketName").value,
      Email: document.querySelector("#updtEmailAddress").value,
      Developer: document.querySelector("#updtAssignee").value,
    })
      .then(() => {
        alert("The document has been updated successfully");
        updateTicketForm.reset();
      })
      .catch(() => {
        alert("Unsuccessful operation: " + error);
      });
  });

  document
    .getElementById("statusDropdown")
    .addEventListener("change", function (e) {
      e.preventDefault();
      // Variables
      let dropDown, tableEl, rows, cells, status, filter;
      dropDown = document.getElementById("statusDropdown");
      tableEl = document.getElementById("myTable");
      rows = tableEl.getElementsByTagName("tr");
      filter = dropDown.value;

      //Loops through rows and hides those with countries that don't match the filter
      for (let row of rows) {
        // `for...of` loops through the NodeList
        cells = row.getElementsByTagName("td");
        status = cells[0] || null; // gets the 2nd `td` or nothing
        // if the filter is set to 'All', or this is the header row, or 2nd `td` text matches filter
        if (filter === "All" || !status || filter === status.textContent) {
          row.style.display = ""; // shows this row
        } else {
          row.style.display = "none"; // hides this row
        }
      }
    });

  document
    .getElementById("priorityStatus")
    .addEventListener("change", function (e) {
      e.preventDefault();
      // Variables
      let dropDown, tableEl, rows, cells, priority, filter;
      dropDown = document.getElementById("priorityStatus");
      tableEl = document.getElementById("myTable");
      rows = tableEl.getElementsByTagName("tr");
      filter = dropDown.value;

      //Loops through rows and hides those with countries that don't match the filter
      for (let row of rows) {
        // `for...of` loops through the NodeList
        cells = row.getElementsByTagName("td");
        priority = cells[3] || null; // gets the 2nd `td` or nothing
        // if the filter is set to 'All', or this is the header row, or 2nd `td` text matches filter
        if (filter === "All" || !priority || filter === priority.textContent) {
          row.style.display = ""; // shows this row
        } else {
          row.style.display = "none"; // hides this row
        }
      }
    });

  document
    .getElementById("mySearchFieldInput")
    .addEventListener("keyup", function (e) {
      e.preventDefault();
      let input, filter, tableEl, tr, td, cell, i, j;
      filter = document
        .getElementById("mySearchFieldInput")
        .value.toLowerCase();
      tableEl = document.getElementById("myTable");
      tr = tableEl.getElementsByTagName("tr");

      for (i = 1; i < tr.length; i++) {
        tr[i].style.display = "none";

        const tdArray = tr[i].getElementsByTagName("td");

        for (let j = 0; j < tdArray.length; j++) {
          const cellValue = tdArray[j];

          if (
            cellValue &&
            cellValue.innerHTML.toLowerCase().indexOf(filter) > -1
          ) {
            tr[i].style.display = "";
            break;
          }
        }
      }
    });

  document
    .querySelector("#ticketManagerTable #deleteMultipleDocs")
    .addEventListener("click", async (e) => {
      e.preventDefault();

      const data = new FormData(document.querySelector("#ticketManagerTable"));

      let selectedTickets = data.getAll("selected");

      selectedTickets.forEach((selectedTicket) => {
        let rootRef = collection(db, "Ticket-table");
        // get a reference to the document
        let docRef = doc(rootRef, selectedTicket);

        deleteDoc(docRef)
          .then(() => {
            alert("The document has been deleted successfully");
          })
          .catch(() => {
            alert("Unsuccessful operation: " + error);
          });
      });
    });

  //Signup button
  const signupButton = document.querySelector("#sign-inButton");
  signupButton.addEventListener("submit", (e) => e.preventDefault);

  //get user information
  const email = document.querySelector("#signup-Email").value;
  const password = document.querySelector("#signup-Password").value;

  //sign up the user
  auth
    .createUserWithEmailAndPassword(email, password)
    .then((userCredential) => {
      let user = userCredential.user;

      createUserInFirestore(user.uid, email);
    })
    .then(() => {
      // User data added to firestore succcessfully
      console.log("User added to firestore");
    })
    .catch((error) => {
      console.log("Error adding user to firestore:", error);
    });

  function createUserInFirestore(userId, email) {
    const usersCollection = collection(db, "Ticket-table");
    const userData = {
      userId: userId,
      email: email,
    };

    usersCollection
      .doc(userId)
      .set(userData)
      .then(() => {
        console.log("user data added to firestore");
      });
  }

  //TEST COMMIT
}

ticketRef(db, commsDB);

// function tickets() {
//   let tableData = document.querySelector("#tableData");

//   let ticketData = {
//     statusCode: 200,
//     message: "success",
//     data: [
//       {
//         id: 1,
//         status: "Open",
//         reference: "T20220610.43",
//         title: "Ticket Title",
//         priority: 5,
//         contact: "Joe Bloggs",
//         engineer: "Mr Engineer",
//         merged: false,
//         mergedCount: 0,
//         replyCount: 0,
//         attachments: 0,
//         created: "Timestamp",
//         user: {
//           id: 1,
//           name: "Jane Doe",
//           email: "Jane.doe@Hotmail.com",
//         },
//       },
//       {
//         id: 2,
//         status: "Ongoing",
//         reference: "T20220610.44",
//         title: "Ticket Title",
//         priority: 1,
//         contact: "Jane Doe",
//         engineer: "Mr Engineer",
//         merged: false,
//         mergedCount: 4,
//         replyCount: 8,
//         attachments: 12,
//         created: "Timestamp",
//         user: {
//           id: 2,
//           name: "Jane Doe",
//           email: "Jane.doe@Hotmail.com",
//         },
//       },
//       {
//         id: 3,
//         status: "On Hold",
//         reference: "T20220610.44",
//         title: "Ticket Title",
//         priority: 1,
//         contact: "Jane Doe",
//         engineer: "Mr Engineer",
//         merged: false,
//         mergedCount: 4,
//         replyCount: 8,
//         attachments: 12,
//         created: "Timestamp",
//         user: {
//           id: 3,
//           name: "Jane Doe",
//           email: "Jane.doe@Hotmail.com",
//         },
//       },
//       {
//         id: 4,
//         status: "Closed",
//         reference: "T20220610.44",
//         title: "Ticket Title",
//         priority: 1,
//         contact: "Jane Doe",
//         engineer: "Mr Engineer",
//         merged: false,
//         mergedCount: 4,
//         replyCount: 8,
//         attachments: 12,
//         created: "Timestamp",
//         user: {
//           id: 4,
//           name: "Jane Doe",
//           email: "Jane.doe@Hotmail.com",
//         },
//       },
//       {
//         id: 5,
//         status: "Escalated",
//         reference: "T20220610.44",
//         title: "Ticket Title",
//         priority: 1,
//         contact: "Jane Doe",
//         engineer: "Mr Engineer",
//         merged: false,
//         mergedCount: 4,
//         replyCount: 8,
//         attachments: 12,
//         created: "Timestamp",
//         user: {
//           id: 5,
//           name: "Jane Doe",
//           email: "Jane.doe@Hotmail.com",
//         },
//       },
//       {
//         id: 6,
//         status: "On Hold",
//         reference: "T20220610.44",
//         title: "Ticket Title",
//         priority: 1,
//         contact: "Jane Doe",
//         engineer: "Mr Engineer",
//         merged: false,
//         mergedCount: 4,
//         replyCount: 8,
//         attachments: 12,
//         created: "Timestamp",
//         user: {
//           id: 6,
//           name: "Jane Doe",
//           email: "Jane.doe@Hotmail.com",
//         },
//       },
//       {
//         id: 7,
//         status: "Open",
//         reference: "T20220610.44",
//         title: "Ticket Title",
//         priority: 1,
//         contact: "Jane Doe",
//         engineer: "Mr Engineer",
//         merged: false,
//         mergedCount: 4,
//         replyCount: 8,
//         attachments: 12,
//         created: "Timestamp",
//         user: {
//           id: 7,
//           name: "Jane Doe",
//           email: "Jane.doe@Hotmail.com",
//         },
//       },
//       {
//         id: 8,
//         status: "Closed",
//         reference: "T20220610.44",
//         title: "Ticket Title",
//         priority: 1,
//         contact: "Jane Doe",
//         engineer: "Mr Engineer",
//         merged: false,
//         mergedCount: 4,
//         replyCount: 8,
//         attachments: 12,
//         created: "Timestamp",
//         user: {
//           id: 8,
//           name: "Jane Doe",
//           email: "Jane.doe@Hotmail.com",
//         },
//       },
//     ],
//   };

//   //open,ongoing,on hold, closed, escalated

// //   tableData.innerHTML = `${ticketData.data
// //     .map(
// //       (a) =>
// //         `<tr>
// //         <td class ="text-center"> <span id="statusColour" class="${statusColourTicket(
// //           a.status
// //         )}">${a.status}</span> </td>
// //         <td class ="text-center">${a.reference}</td>
// //         <td class ="text-center">${a.title}</td>
// //         <td class ="text-center">${a.priority}</td>
// //         <td class ="text-center">${a.contact}</td>
// //         <td class ="text-center">${a.engineer}</td>
// //         <td class ="text-center">${a.merged}</td>
// //         <td class ="text-center">${a.mergedCount}</td>
// //         <td class ="text-center">${a.replyCount}</td>
// //         <td class ="text-center">${a.attachments}</td>
// //         <td class ="text-center">${a.created}</td>
// //         <td class ="text-center">${a.user.id}</td>
// //         <td class ="text-center">${a.user.name}</td>
// //         <td class ="text-center">${a.user.email}</td>
// //         </tr>`
// //     )
// //     .join("")}`;
// // }

// // function statusColourTicket(currentColour) {
// //   if (currentColour === "Open") {
// //     return "badge rounded-pill bg-success ";
// //   } else if (currentColour === "Ongoing") {
// //     return "badge rounded-pill bg-warning";
// //   } else if (currentColour === "On Hold") {
// //     return "badge rounded-pill bg-primary";
// //   } else if (currentColour === "Closed") {
// //     return "badge rounded-pill bg-danger";
// //   } else if (currentColour === "Escalated") {
// //     return "badge rounded-pill bg-info";
// //   }
// // }
