const slider = document.querySelector(".slider");
const passLenNum = document.querySelector(".pass_len_num");
const passArea = document.querySelector(".pass_area");
const copyButton = document.querySelector(".copy_button");
const copyText = document.querySelector(".copy_text");
const uppercaseBox = document.querySelector(".uppercase_box");
const lowercaseBox = document.querySelector(".lowercase_box");
const numberBox = document.querySelector(".number_box");
const symbolBox = document.querySelector(".symbol_box");
const strengthiIndicator = document.querySelector(".strength_indicator");
const genPas = document.querySelector(".gen_pass");
const allChechbox = document.querySelectorAll("input[type=checkbox]");
const Symbols = "!@#$%&*_?/";

// functions for working
let password = "";
let passlen = 10;
let count = 0;
LenghtSlider();
IndicatorColor("#fff")
//lenght of password
function LenghtSlider(){
    slider.value = passlen;
    passLenNum.innerText = passlen;
    const _min = slider.min;
    const _max = slider.max;
    slider.style.backgroundSize = (passlen - _min)*100/(_max - _min) + "% 100%";
}

//set indicator color
function IndicatorColor(color){
    strengthiIndicator.style.backgroundColor = color;
    strengthiIndicator.style.boxShadow = `0px 0px 12px 1px ${color}`;
}

// generate random number from min to max
function GetRandomNum(min, max){
    return Math.floor(Math.random()*(max-min))+min;
}

//any int number
function RandomIntValue(){
    return GetRandomNum(0,9);
}

// any number for Upper Case
function RandomUpperValue(){
    return String.fromCharCode(GetRandomNum(65,91));
}

// any number for lower case
function RandomLowerValue(){
    return String.fromCharCode(GetRandomNum(97,123));
}

// any symbols from symbols list
function RandomSymbolValue(){
    const randSym = GetRandomNum(0,Symbols.length);
    return Symbols.charAt(randSym);

}

// function to set color according to strenght
function SetStrengthColor(){
    let Upper ,Lower, Symb, Num;
    Upper = (uppercaseBox.checked) ? true : false;
    Lower = (lowercaseBox.checked) ? true : false;
    Symb = (symbolBox.checked) ? true : false;
    Num = (numberBox.checked) ? true : false;

    if(Upper && Lower && Symb && Num && passLenNum >= 8){
        // green for Strong
        IndicatorColor('#008000');
    }
    else if(Upper && Lower && (Num || Symb) && passLenNum >= 8){
        // Orange good
        IndicatorColor('#ffa500');
    }
    else if(Upper && Lower && passLenNum >= 8){
        // yellow normal
        IndicatorColor('#ffff41');
    }
    else if((Upper || Lower) && passLenNum >= 8){
        //light red littel weak
        IndicatorColor('##ff5c5c');
    }
    else{
        //dark red weak
        IndicatorColor('#ff0000');
    }
}

// function to copy the pass to clipboard
async function CopyToClipBoard(){
    try{
        await navigator.clipboard.writeText(passArea.value);
        copyText.innerText = "Copied";
    }
    catch{
        copyText.innerText = "Failed";
    }

    // removing text copied after clocking copie button
    copyText.classList.add("active");

    setTimeout( () =>{
        copyText.classList.remove("active");
    },2000);
}

function CheckUnchecked(){
    count = 0;
    allChechbox.forEach( (checkbox) =>{
        if(checkbox.checked){
            count++;
        }
    });

    if(passlen < count){
        passlen = count;
        LenghtSlider();
    }
}

function SuffelPass(array){
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        const temp = array[i];
        array[i] = array[j];
        array[j] = temp;
      }
    let str = "";
    array.forEach((el) => (str += el));
    return str;
}

allChechbox.forEach((checkbox) =>{
    checkbox.addEventListener('change', CheckUnchecked)
})

// event when slider is moved
slider.addEventListener('input', (e) =>{
    passlen = e.target.value;
    LenghtSlider();
});

// event when copied button is clicked
copyButton.addEventListener('click', () =>{
    if(passArea.value)
    CopyToClipBoard();
});

//event when generatebutton is clicked
genPas.addEventListener('click', () =>{
    if(count == 0) 
    return;

    if(passlen < count){
        passlen = count;
        LenghtSlider();
    }

    password = "";
    let FuncArr = [];

    if(uppercaseBox.checked)
        FuncArr.push(RandomUpperValue);
    if(lowercaseBox.checked)
        FuncArr.push(RandomLowerValue);
    if(symbolBox.checked)
        FuncArr.push(RandomSymbolValue);
    if(numberBox.checked)
        FuncArr.push(RandomIntValue);

    for(let i=0; i<FuncArr.length;i++){
        password += FuncArr[i]();
    }

    for(let i=0; i<passlen-FuncArr.length;i++){
        let index = GetRandomNum(0,FuncArr.length);
        password += FuncArr[index]();
    }

    password = SuffelPass(Array.from(password));

    passArea.value = password;

    SetStrengthColor();
});