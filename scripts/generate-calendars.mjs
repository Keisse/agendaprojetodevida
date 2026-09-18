import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';

const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const siteDir=path.join(root,'site');
const calendarsDir=path.join(siteDir,'calendarios');
fs.rmSync(calendarsDir,{recursive:true,force:true});fs.mkdirSync(calendarsDir,{recursive:true});

const sessions=[
['Comece pelo seu porquê','Leia as páginas 14 a 21. Entenda o que é um projeto de vida e por que ele vai além de uma lista de metas.','Que mudança você deseja perceber em sua vida ao final desta jornada?'],
['Desenhe uma direção para a sua vida','Leia as páginas 22 a 27. Observe os mitos sobre planejamento e os diferentes caminhos possíveis.','Qual área da sua vida mais precisa de direção neste momento?'],
['Reconheça seus valores e sua identidade','Leia as páginas 28 a 39. Explore os fundamentos do autoconhecimento.','Quais três valores você não aceita negociar?'],
['Aprofunde o autoconhecimento','Leia as páginas 40 a 47. Observe seus papéis, relacionamentos e padrões.','Em qual papel da sua vida você se sente mais autêntico?'],
['Marco 1 — registre quem você é','Leia as páginas 48 a 57 e faça um exercício. Compartilhe um aprendizado no Instagram usando #MeuProjetoDeVida e siga as regras para participar do sorteio mensal de uma conversa de 15 minutos com Mario Trentim.','O que você descobriu sobre si que merece ser lembrado?'],
['Prepare-se para o futuro','Leia as páginas 58 a 70. Conheça as habilidades cognitivas e socioemocionais mais relevantes.','Qual habilidade pode ampliar suas oportunidades agora?'],
['Fortaleça suas competências','Leia as páginas 71 a 78. Reflita sobre aprendizagem contínua, sustentabilidade e liderança.','Que habilidade você pode praticar ainda nesta semana?'],
['Transforme habilidade em ação','Leia as páginas 79 a 89 e escolha um exercício prático do capítulo.','Qual pequeno experimento ajudará você a desenvolver essa habilidade?'],
['Conecte propósito, valores e metas','Leia as páginas 90 a 103. Conheça SMART, OKRs e Kanban pessoal.','Qual objetivo traduz melhor o futuro que você quer construir?'],
['Marco 2 — escreva uma meta clara','Leia as páginas 104 a 111. Compartilhe sua meta no Instagram com #MeuProjetoDeVida e siga as regras para participar do sorteio mensal de uma conversa de 15 minutos com Mario Trentim.','Como sua meta pode ficar específica, mensurável e realista?'],
['Proteja suas prioridades','Leia as páginas 112 a 121. Organize tempo, energia e metas concorrentes.','O que você precisa deixar de fazer para priorizar o essencial?'],
['Revise e sustente suas metas','Leia as páginas 122 a 131. Observe motivação, disciplina e próximos passos.','Qual será a primeira ação concreta e quando você a realizará?'],
['Reencontre propósito no trabalho','Leia as páginas 132 a 145. Explore as transformações profissionais e o sentido do trabalho.','Que tipo de impacto você deseja gerar por meio do seu trabalho?'],
['Una talento, paixão e oportunidade','Leia as páginas 146 a 157. Reflita sobre marca pessoal, networking e transições.','Onde suas habilidades encontram uma necessidade real do mundo?'],
['Marco 3 — desenhe seu próximo movimento','Leia as páginas 158 a 169. Compartilhe a reflexão no Instagram com #MeuProjetoDeVida e siga as regras para participar do sorteio mensal de uma conversa de 15 minutos com Mario Trentim.','Qual conversa, teste ou aprendizado pode aproximar você do próximo passo?'],
['Desenvolva resiliência','Leia as páginas 170 a 181. Diferencie planejar de tentar controlar tudo.','Como você costuma reagir quando seus planos mudam?'],
['Pratique uma mentalidade de crescimento','Leia as páginas 182 a 190. Trabalhe flexibilidade e aprendizagem com os erros.','O que uma dificuldade recente pode ensinar a você?'],
['Fortaleça-se para continuar','Leia as páginas 191 a 204. Faça um exercício de resiliência e revise seu projeto.','Que apoio, hábito ou recurso ajudará você nos momentos difíceis?'],
['Marco 4 — integre os cinco pilares','Leia as páginas 205 a 221. Compartilhe uma síntese no Instagram com #MeuProjetoDeVida e siga as regras para participar do sorteio mensal de uma conversa de 15 minutos com Mario Trentim.','Qual dos cinco pilares mais transformou sua maneira de pensar?'],
['Coloque seu projeto no papel','Use os exercícios dos anexos, a partir da página 229. Escreva objetivos, razões e compromissos.','Qual compromisso você assume consigo a partir de hoje?'],
['Marco final — mantenha o projeto vivo','Revise suas anotações. Compartilhe a conclusão no Instagram com #MeuProjetoDeVida e siga as regras para participar do sorteio mensal de uma conversa de 15 minutos com Mario Trentim.','Qual será seu próximo passo nas próximas 24 horas?']
];

const pad=n=>String(n).padStart(2,'0');
const dateKey=d=>`${d.getUTCFullYear()}-${pad(d.getUTCMonth()+1)}-${pad(d.getUTCDate())}`;
const icsDate=d=>dateKey(d).replaceAll('-','');
const addDays=(d,n)=>new Date(d.getTime()+n*86400000);
const escapeIcs=value=>value.replace(/\\/g,'\\\\').replace(/\n/g,'\\n').replace(/,/g,'\\,').replace(/;/g,'\\;');
function fold(line){const chars=[...line];const rows=[];let row='';for(const char of chars){if(Buffer.byteLength(row+char)>73){rows.push(row);row=' '+char}else row+=char}if(row)rows.push(row);return rows.join('\r\n')}
function businessDates(start,count){const dates=[];let current=new Date(start);while(dates.length<count){const day=current.getUTCDay();if(day!==0&&day!==6)dates.push(new Date(current));current=addDays(current,1)}return dates}
function buildCalendar(start){
 const dates=businessDates(start,sessions.length);const stamp=new Date().toISOString().replace(/[-:]/g,'').replace(/\.\d{3}/,'');
 const lines=['BEGIN:VCALENDAR','VERSION:2.0','PRODID:-//Projeto de Vida//Jornada de Leitura//PT-BR','CALSCALE:GREGORIAN','METHOD:PUBLISH','X-WR-CALNAME:Projeto de Vida — Jornada de Leitura','BEGIN:VTIMEZONE','TZID:America/Sao_Paulo','X-LIC-LOCATION:America/Sao_Paulo','BEGIN:STANDARD','TZOFFSETFROM:-0300','TZOFFSETTO:-0300','TZNAME:-03','DTSTART:19700101T000000','END:STANDARD','END:VTIMEZONE'];
 sessions.forEach((session,index)=>{const n=index+1,day=icsDate(dates[index]);const description=`LEITURA E PRÁTICA ${n} DE 21\n\nEste é um tempo que você reservou para ler o guia Projeto de Vida, refletir sobre o conteúdo e realizar os exercícios propostos. Não é um encontro ou uma atividade ao vivo.\n\nO QUE FAZER HOJE\n${session[1]}\n\nPERGUNTA PARA REFLEXÃO\n${session[2]}\n\nReserve estes 30 minutos para avançar com calma. O objetivo é construir seu projeto de vida um passo de cada vez.`;lines.push('BEGIN:VEVENT',`UID:projeto-de-vida-${dateKey(start)}-${day}-${n}@agendaprojetodevida.trentim.com`,`DTSTAMP:${stamp}`,`DTSTART;TZID=America/Sao_Paulo:${day}T213000`,`DTEND;TZID=America/Sao_Paulo:${day}T220000`,fold(`SUMMARY:${escapeIcs(`Projeto de Vida ${n}/21 — ${session[0]}`)}`),fold(`DESCRIPTION:${escapeIcs(description)}`),'STATUS:CONFIRMED','TRANSP:OPAQUE','BEGIN:VALARM','TRIGGER:-PT1H','ACTION:DISPLAY',fold(`DESCRIPTION:${escapeIcs(`Em 1 hora: seu período de leitura — ${session[0]}`)}`),'END:VALARM','END:VEVENT')});
 lines.push('END:VCALENDAR');return lines.join('\r\n')+'\r\n';
}

const today=new Date();const min=new Date(Date.UTC(today.getUTCFullYear(),today.getUTCMonth(),today.getUTCDate()));const max=new Date(min);max.setUTCFullYear(max.getUTCFullYear()+3);
for(let date=new Date(min);date<=max;date=addDays(date,1))fs.writeFileSync(path.join(calendarsDir,`${dateKey(date)}.ics`),buildCalendar(date));
fs.writeFileSync(path.join(siteDir,'calendar-range.json'),JSON.stringify({min:dateKey(min),max:dateKey(max)},null,2)+'\n');
console.log(`Generated calendars from ${dateKey(min)} through ${dateKey(max)}.`);
