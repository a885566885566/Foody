$(document).ready(function(){

    /* Clear inputs */
    function clearInput(){
        $("#in_name").val("")
        $("#in_price_up").val("")
        $("#in_price_low").val("")
    }

    var mode_adding = false
    /* Change mode between adding or normal */
    function changeMode(){
        clearInput()
        mode_adding = !mode_adding
        if(mode_adding){
            $("#btn_add").text("x")
            $("#div_add").removeClass("invisible")
            $("#btn_submit").text("Submit")
        }
        else{
            $("#btn_add").text("+")
            $("#div_add").addClass("invisible")
            $("#btn_submit").text("Random")
        }
    }

    /* Detect the invalid input and notify user */
    function handleInvalidInput(){
        if( $("#in_name").val() == "" ||
            $("#in_price_up").val() == "" ||
            isNaN( $("#in_price_up").val() ) ||
            $("#in_price_low").val() == "" ||
            isNaN( $("#in_price_low").val() )){
            alert("Please fill in all blocks.")
        }
        else if( $("#select_class").selectedIndex == 0){
            alert("Please choose a class.")
        }
        else if( $("#in_price_up").val() - $("#in_price_low").val() <= 0){
            alert("The upper bound should be larger than the lower bound.")
        }
        else
            return true
        return false
    }

    /* Initial request to get page info */
    $.getJSON("/initial", (sel_list)=>{
        console.log(sel_list)
        var sel_names = Object.keys(sel_list)
        sel_names.forEach((sel_name)=>{
            sel_list[sel_name].forEach((option)=>{
                $(sel_name).append(new Option(option))
            })
        })
        // Default selection
        $("#select_class").selectedIndex = 0
    })

    /* In adding mode, submit a new food
       In normal mode, get random food */
    $("#btn_submit").click((data)=>{
        var sel_class = $("#select_class :selected").text()
        var price_up =  $("#in_price_up").val()
        var price_low = $("#in_price_low").val()

        if(mode_adding){
            // Return false if inputs are invalid
            if( !handleInvalidInput() )
                return 
            console.log("Add new food")
            var name = $("#in_name").val()
            var url = `/add?name=${name}&classes=${sel_class}&price_up=${price_up}&price_low=${price_low}`
            $.get(url, (res)=>{
                clearInput()
                if( res == "ok" ){
                    console.log(res)
                }
                else{
                    console.log(res)
                    $("#info").text(res)
                    $("#message_board").removeClass("invisible")
                    setTimeout(()=>{
                        $("#message_board").addClass("invisible")
                    }, 2000)
                }
            })
        }
        else{
            if (price_up == "" || isNaN(price_up)) price_up = 99999
            if (price_low == "" || isNaN(price_low)) price_low = 0

            var url = `/random?classes=${sel_class}&price_up=${price_up}&price_low=${price_low}`
            $.getJSON(url, (result)=>{
                console.log(result)
                var item = result[Math.floor(Math.random()*result.length)]
                var block = $(`
                    <div class='result'>
                    <span class='circle'></span>
                    <span class="label">${item.name}</span>
                    <span class="tag">
                    <p>Price</p>
                    <p>${item.price_low} ~ ${item.price_up}</p>
                    </span>
                    </div>`)
                $("#result_list").prepend(block)
            })
        }
    })
    $("#btn_add").click((data)=>{
        changeMode() 
    })
})

