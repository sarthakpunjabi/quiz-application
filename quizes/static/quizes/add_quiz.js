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
console.log(data['choice'])
data['type'] = "multiple"
console.log(data)

$.ajax({
    type:'POST',
    url:`${url}`,
    data:data,
    success:function(response){
        addForm.classList.add('not-visible')
        const result = response.data
        console.log(result)
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