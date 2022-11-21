const available_lift = new Map();
const lift_position = new Map();
const pending_calls = [];
const floor_lift = new Map();
let floorcount;
let liftcount;
document.querySelector(".generate").addEventListener("click", (event) => {
    event.preventDefault();
    var floors = document.querySelector(".floor");
    var lifts = document.querySelector(".lift");
    floorcount = floors.value;
    liftcount = lifts.value;
    if (floorcount < 1 || floorcount > 100) {
        alert("floor count should lie between 1 and 100")
        return
    }
    if (liftcount < 1 || liftcount > 10) {
        alert("lift count should lie between 1 and 10")
        return
    }
    if (floors !== "" && lifts !== "") {
        document.querySelector(".inputform").classList.add("hide")
    }
    makefloors(floorcount);
    makelifts(liftcount);
})

function makefloors(floors) {
    const floorContainer = document.querySelector("#container");
    for (let i = floors - 1; i >= 0; i--) {
        var floor = document.createElement("section");
        floor.classList.add("section")
        var floorId = `floor-${i}`;
        floor.id = `floor-${i}`;

        floor.innerHTML = `<section class="floor-details">
            <div class="left">
            <p class="floor_id">Floor-${i}</p> 
            <button class="call_btn">CALL</button>
            </div> 
            </section>
           `
        floor.querySelector(".call_btn").addEventListener("click", (event) => liftcall(event));
        floorContainer.appendChild(floor);
        floor_lift.set(floorId, null);
    }
}




function makelifts(lifts) {
    const firstfloor = document.querySelector("#floor-0");
    for (let j = 1; j <= lifts; j++) {
        var lift = document.createElement("section");
        lift.classList.add('lifts')
        lift.id = `lift-${j}`
        lift.innerHTML = `
         <section class="door left-door"></section>
         <section class="door right-door"></section>
        `;
        firstfloor.appendChild(lift);
        available_lift.set(`lift-${j}`, true);
        lift_position.set(`lift-${j}`, 0);
    }
}

function movelift(called_floorid, liftId) {
    if (floor_lift.get(called_floorid) != null) {
        const listid = floor_lift.get(called_floorid);
        if (available_lift.get(listid)) {
            available_lift.set(listid, false)
            for_pending(called_floorid, listid);
        }
        return
    }
    available_lift.set(liftId, false);
    floor_lift.set(called_floorid, liftId);
    floor_lift.forEach((value, key) => {
        if (key !== called_floorid && value === liftId) {
            floor_lift.set(key, null);
        }
    });
    const floor = document.querySelector(`#${called_floorid}`);
    const lift = document.querySelector(`#${liftId}`);
    const floor_id_array = called_floorid.split('-');
    const floorNumber = parseInt(floor_id_array[floor_id_array.length - 1]);
    const prevFloor = lift_position.get(liftId);
    const floordiff = Math.abs(floorNumber - prevFloor);
    const transitionDuration = floordiff * 2;
    lift.style.transform = `translateY(-${floorNumber * 21}rem)`;
    lift.style.transition = `all ${transitionDuration}s`;
    setTimeout(() => {
        for_pending(called_floorid, liftId);
    }, transitionDuration * 1000);
    lift_position.set(liftId, floorNumber);
}

function liftcall(event) {
    const floorcalled = (event?.path[3]);
    const called_floorid = floorcalled.id
    if (floor_lift.get(called_floorid) != null) {
        const listid = floor_lift.get(called_floorid);
        if (available_lift.get(listid)) {
            available_lift.set(listid, false)
            for_pending(called_floorid, listid);
        }
        return
    }
    for (var i = 1; i <= liftcount; i++) {
        const liftId = `lift-${i}`;
        if (available_lift.get(liftId)) {
            movelift(called_floorid, liftId);
            return;
        }
    }
    pending_calls.push(called_floorid);
}

function for_pending(called_floorid, liftId) {


    const lift = document.querySelector(`#${liftId}`);
    const leftDoor = lift.querySelector(".left-door");
    const rightDoor = lift.querySelector(".right-door");
    leftDoor.classList.add("left-move");
    rightDoor.classList.add("right-move");  
    setTimeout(() => {
        leftDoor.classList.remove("left-move");
        rightDoor.classList.remove("right-move"); 
        setTimeout(() => {
            available_lift.set(liftId, true);
            if (pending_calls.length > 0) {
                const remaining = pending_calls[0];
                pending_calls.shift();
                movelift(remaining, liftId);
            }
        }, 2500);
    }, 2500);



   
}