const dateInput=document.getElementById('startDate');
const downloadButton=document.getElementById('downloadButton');
const status=document.getElementById('status');

const localDateString=date=>{
  const pad=value=>String(value).padStart(2,'0');
  return `${date.getFullYear()}-${pad(date.getMonth()+1)}-${pad(date.getDate())}`;
};

async function configureRange(){
  try{
    const response=await fetch('calendar-range.json',{cache:'no-store'});
    if(!response.ok)throw new Error('range unavailable');
    const range=await response.json();
    dateInput.min=range.min;
    dateInput.max=range.max;
  }catch{
    const today=new Date();
    const max=new Date(today);max.setFullYear(max.getFullYear()+3);
    dateInput.min=localDateString(today);
    dateInput.max=localDateString(max);
  }
}

dateInput.addEventListener('change',()=>{
  downloadButton.disabled=!dateInput.value;
  status.textContent='';
});

downloadButton.addEventListener('click',()=>{
  if(!dateInput.value){dateInput.reportValidity();return;}
  if(dateInput.min&&dateInput.value<dateInput.min||dateInput.max&&dateInput.value>dateInput.max){
    status.textContent='Escolha uma data dentro do período disponível.';return;
  }
  status.textContent='Preparando seu calendário…';
  window.location.assign(`calendarios/${encodeURIComponent(dateInput.value)}.ics`);
});

configureRange();
