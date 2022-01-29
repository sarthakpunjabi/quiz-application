console.log("Add_quiz")

const addForm = document.getElementById('addForm')
const submit = document.querySelector('#submit')
const question_answer = document.getElementById('que-ans')

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
        const data = response.data
        data.forEach(el => {
            for (const [question,incorrect_answers,correct_answer] of Object.entries(el)){
                console.log(question)
                console.log(incorrect_answers)
                console.log(correct_answer)
            }
        });
        
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