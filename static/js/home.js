function toggleDescription(id){

    const desc = document.getElementById("desc"+id);

    if(desc.classList.contains("show")){
        desc.classList.remove("show");
    }
    else{
        desc.classList.add("show");
    }

}

const quantities = {};

function changeQuantity(bookId,change){

    if(!quantities[bookId]){
        quantities[bookId]=0;
    }

    quantities[bookId]+=change;

    if(quantities[bookId]<0){
        quantities[bookId]=0;
    }

    document.getElementById("qty"+bookId).textContent=
        quantities[bookId];

}