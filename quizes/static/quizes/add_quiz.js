console.log("Add_quiz")

const addForm = document.getElementById('addForm')
const submit = document.querySelector('#submit')
const modalBtn = document.getElementById('modbtn')
const url = window.location.href
const saveBtn = document.getElementById('savebtn')
const quizBox = document.getElementById('quiz-box')
const quiForm = document.getElementById('quiz-form')
const saveModalBtn = document.getElementById('save-modal-form')
const modalForm = document.getElementById('modal-form')
const question = document.getElementById('addquestion')
const incorrect = [...document.getElementsByClassName('op')]
const correct = document.getElementById('op4')
const goibibo = [...document.getElementsByClassName('goibibo')]
let maindata



const showData = (data) => {
    quizBox.innerHTML = ""
    quizBox.innerHTML += `
        <div class="mb-2">
            <b><h1>${data[1].category}</h1></b>
        </div>
        `
        console.log(data)
        data.forEach(el => {
                quizBox.innerHTML += `
                    <hr>
                    <div class="mb-2">
                        <b>${el.question}</b>
                    </div>
                    
                `
                el.incorrect_answers.forEach(answer=>{
                    quizBox.innerHTML += `
                        <div>
                            <input type='radio' class='ans' id='${el.question}-${answer}' name='${el.question}' value='${answer}' disabled>
                            <label for='${el.question}'>${answer}</label>
                        </div>
                        
                    `
                })

                quizBox.innerHTML += `
                <div>
                    <input type='radio' class='ans' id='${el.question}-${el.correct_answer}' name='${el.question}' value='${el.correct_answer}' checked>
                    <label for='${el.question}'>${el.correct_answer}</label>
                </div>
                <br>
                `
            
        })
}



const sendData = () => {

const amount = document.getElementById('num_of_question')
const difficulty = document.querySelector('#difficult')
const choice = document.querySelector('#cho')
const data = {}
const csrf = document.getElementsByName('csrfmiddlewaretoken')
data['csrfmiddlewaretoken'] = csrf[0].value
data['amount'] = amount.value
data['difficulty'] = difficulty.value
data['choice'] = choice.value
data['type'] = "multiple"

$.ajax({
    type:'POST',
    url:`${url}`,
    data:data,
    success:function(response){
        addForm.classList.add('not-visible')
        quiForm.classList.remove('not-visible')
        modalBtn.classList.remove('not-visible')
        saveBtn.classList.remove('not-visible')
        goibibo.forEach(goib=>{
            goib.classList.remove('not-visible')
            
        })
        
        
        const data = response.data
        maindata = data
        showData(data)
        
    },

    error:function(response){
        console.log(response)
    }
})

}


addForm.addEventListener('submit',e=>{
    e.preventDefault()
    sendData()
    
})

saveModalBtn.addEventListener('click',e=>{
    e.preventDefault()
    incans = []
    incorrect.forEach(inc =>{
        incans.push(inc.value)
        inc.value=""
    })
    obj = {"question":question.value,"correct_answer":correct.value,"incorrect_answers":incans}
    incans=[]
    question.value=""
    correct.value=""
    maindata.push(obj)
    
})

saveBtn.addEventListener('click',e=>{
    e.preventDefault()
    const goinp = [...document.getElementsByClassName('goinp')]
    const csrf = document.getElementsByName('csrfmiddlewaretoken')
    data['csrfmiddlewaretoken'] = csrf[0].value
    metaData = {}
    
    goinp.forEach(going =>{
        metaData[going.getAttribute('name')] = going.value
    })
    console.log(metaData)

    $.ajax({
        type:'POST',
        url:`${url}save`,
        data:{'data':maindata,'meta':metaData},
        success:function(response){
            console.log("Submitted")
        },
        error:function(response){
            console.log(response)
        }
    })
})
