import "./styles/style.scss";

//import moment
import moment from "moment";
moment().format();

//import Chart.JS
import Chart from "chart.js/auto";

// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics, setDefaultEventParameters } from "firebase/analytics";
import {
  arrayRemove,
  DocumentSnapshot,
  getFirestore,
  collection,
  doc,
  setDoc,
  getDoc,
  getDocs,
  deleteDoc,
  updateDoc,
  orderBy,
  writeBatch,
  serverTimestamp,
  Timestamp,
} from "firebase/firestore";
import { getDatabase } from "firebase/database";
import { Firestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyD2x9eOF0QlP_GW7RRN0vPH-9RiTpFR3o4",
  authDomain: "ticket-table.firebaseapp.com",
  projectId: "ticket-table",
  storageBucket: "ticket-table.appspot.com",
  messagingSenderId: "714999952537",
  appId: "1:714999952537:web:dbdb1e306d5563ca467408",
  measurementId: "G-7077X5Y5YP",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
// Initialize Cloud Firestore and get a reference to the service
const db = getFirestore(app);

async function ticketRef(db) {
  let r = await getDocs(collection(db, "Ticket-table"));
  let tableData = document.getElementById("tableData");

  let tickets = [];
  r.forEach((doc) => {
    tickets.push(doc);
  });

  //console.log(tickets);

  const tableEl = document.getElementById("tableData");

  const create = (tag = "div", options = {}) =>
    Object.assign(document.createElement(tag), options);

  tableEl.append(
    ...tickets.map((ticket) => {
      const row = create("tr");
      const checkBoxCell = create("td", { className: "text-center" });
      const checkBoxLabel = create("label");

      checkBoxLabel.append(
        create("input", {
          type: "checkbox",
          className: "form-check-input", // You were creating duplicate `ids`
          name: "selected",
          value: ticket.id,
        }),
        create("span", { textContent: ticket.id })
      );

      checkBoxCell.append(checkBoxLabel);

      const cells = [
        "Status",
        "ticketTitle",
        "Priority",
        "Created",
        "Name",
        "Email",
        "Assignee",
      ].map((field) =>
        create("td", {
          textContent: ticket.data()[field],
          className: "text-center",
        })
      );

      cells.splice(1, 0, checkBoxCell);
      row.append(...cells);
      return row;
    })
  );

  //   So you'll want to hit either a web server endpoint, or a Cloud Function with an HTTP trigger, with the new element added.
  // This Cloud Function would write the new doc to the database. So it would look like this:
  //
  // 1. On your website: Create a new checkbox elem with a new ID... const newId = genId();
  // 2. Send that new elem to the Cloud Function... await fetch.post(cloudFunctionUrl, { id: newId, ...otherData })
  // 3. That Cloud Function will have access to the DB, being in the same Firebase project.
  //    Write to the db, db.set(collectionPath + newId, otherData)
  // 4. Now you can delete via another API

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

    let m = moment();
    let mFormatted = m.format("dddd, MMMM Do YYYY, h:mm A"); // "2014-09-08T08:02:17-05:00" (ISO 8601, no fractional seconds)

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
    //console.log(Date());
    alert("Your form is submitted successfully");
    document.querySelector("#ticketForm").reset();
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

    // if (docs.length >= 1) {
    //   //deleteDoc(docRef).map((a) => a.id);
    //   docRef.length;
    // }

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
  const updateTicketStatus = document.querySelector("#tktStatus");
  const updateTicketTitle = document.querySelector("#ticketTitle");
  const updateTicketPriority = document.querySelector("#ticketPriority");
  const updateTicketName = document.querySelector("#ticketName");
  const updateTicketEmailAddress = document.querySelector("#emailAddress");
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
        //location.reload();
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
}
ticketRef(db);

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
