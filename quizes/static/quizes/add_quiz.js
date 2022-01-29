console.log("Add_quiz")

const addForm = document.getElementById('addForm')
const submit = document.querySelector('#submit')
const question_answer = document.getElementById('que-ans')
const quizBox = document.getElementById('quiz-box')
const quiForm = document.getElementById('quiz-form')



const sendData = () => {
const url = window.location.href
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
        
        const data = response.data
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