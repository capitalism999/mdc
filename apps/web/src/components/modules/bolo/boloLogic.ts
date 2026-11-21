// @ts-nocheck
import { GEO as SA_GEO } from '../shared/sanAndreasMap'
import { ownPhoto } from '../shared/personPhotos'
import { vehiclePhoto } from '../shared/vehiclePhotos'
import { mockProfile } from '../../../lib/mockData/profile'
import { activeBoloSrc } from '../../../lib/session'
import { SEARCH_DB } from '../search/searchLogic'
/* Verbatim port of the design reference's component logic (project/BOLO.dc.html,
 * <script data-dc-script>): all records, derivations and handlers are unchanged so
 * every screen state renders exactly as in the reference. Ours: the DCLogic base
 * class below (the reference runtime's minimal state container) and the changes
 * marked «MDT:» — places and sightings moved onto the real San Andreas map,
 * «Опубликовать» adds a BOLO built from the form, a person sent from Поиск fills
 * the form, links open the module that owns the record. */

class DCLogic {
  constructor(props) {
    this.props = props
    this.state = {}
    this.__onChange = null
  }
  setState(patch) {
    this.state = Object.assign({}, this.state, patch)
    if (this.__onChange) this.__onChange()
  }
}

// kind: person | veh | missing | unknown
var SRC = { lspd: ['LSPD', 'Полиция Лос-Сантоса', 'blue'], lssd: ['LSSD', 'Шериф округа', 'green'], sahp: ['SAHP', 'Дорожный патруль', 'amber'], fib: ['FIB', 'Федеральное бюро', 'grey'] };
var PHIMG = { cam: '/assets/bolo/f5933435926d04ddd76fa09ea0409685.png', tattoo: '/assets/bolo/851491204589cc7db98aa627f5692445.png', mug: '/assets/bolo/0beed155fce0828779f15482eb63b5dd.png' };
var PHI = { mug: 'M10 9a3.2 3.2 0 100-6.4A3.2 3.2 0 0010 9zM3.5 17.5c0-3.6 2.9-6 6.5-6s6.5 2.4 6.5 6', cam: 'M3 6.5h3l1.5-2h5l1.5 2h3v10H3zM10 8a3 3 0 100 6 3 3 0 100-6z', car: 'M3 13v-3l2-4h10l2 4v3zM3 13v2h2v-2M15 13v2h2v-2', tattoo: 'M10 3c3 3 4 6 1 9s-2 5 0 5M7 7c-2 2-2 4 0 6', obj: 'M4 7h12v9H4zM7 7V5h6v2' };
var PHB = { mug: ['#4A505A', '#2F343C'], cam: ['#3B4B5E', '#232E3B'], car: ['#4A4F45', '#2C3029'], tattoo: ['#5A4A50', '#352C30'], obj: ['#50493E', '#302B24'] };
var PX = {
  e423: { unit: 'Rockford Hills Station · отдел ограблений', caseNo: '', wantedFor: 'Грабежи с преследованием до дома',
    paras: ['Участились уличные грабежи: преступники выбирают жертву у бутиков на Portola Drive, в ночных клубах и дорогих ресторанах Vinewood, едут следом и грабят у дома или у бизнеса. Чаще всего забирают дорогие часы, украшения и сумки, выбирают и по машине.', 'С начала ноября — 9 случаев в Rockford Hills, Vinewood и Burton. Задержаны несколько подозреваемых, но действуют разные группы.'],
    contact: 'Отдел ограблений LSPD, Rockford Hills: 555-0144. Если вы в опасности — 911.', approved: 'Утвердил: Капитан D. Hayes, Rockford Hills Station' },
  e422: { unit: 'Mission Row Station · штаб по чрезвычайным ситуациям', caseNo: 'ЧС-26-014', wantedFor: 'Сильный ливень: вода в каналах Vespucci поднялась выше набережной', mainCap: 'Затопленная улица, Vespucci Canals, 06:20', name: 'Подтопление в Vespucci',
    facts: [['Что случилось', 'Подтопление улиц после ливня'], ['Где', 'Vespucci Canals, Vespucci Beach, Del Perro'], ['Перекрыто', 'Prosperity St, Magellan Ave'], ['Убежище', 'Школа Vespucci, 200 мест'], ['Питьевая вода', 'Раздают у пирса Del Perro']],
    incident: [['НАЧАЛО', '18.11.2026, 05:40'], ['ПРОГНОЗ', 'Дождь до вечера'], ['УРОВЕНЬ', 'Опасный']],
    narr: 'Не заходите в воду и не пытайтесь проехать по затопленной дороге. Отключите электричество, если вода в доме. Помогите пожилым соседям подняться на верхние этажи.',
    contact: 'Если вы или кто-то рядом в опасности — звоните 911. Справки об убежищах и перекрытиях: 311.' },
  b412: { name: 'Tyrone Webb', unit: 'Mission Row Station · отдел расследований', caseNo: 'Дело SW-2611 · ордер W-2231', wantedFor: 'За вооружённое ограбление (PC 216) и нападение с оружием (PC 207)', mainCap: 'Фото из личного дела, 2025',
    facts: [['Пол, возраст', 'Мужской, 28 лет'], ['Рост, вес', '188 см · ~95 кг'], ['Волосы, глаза', 'Чёрные, короткие · карие'], ['Приметы', 'Тату «FDB» на шее, шрам на правой руке'], ['Транспорт', 'Bravado Bison, чёрный, 87PLN903'], ['Где бывает', 'Grove St, Forum Dr, Davis Ave']],
    incident: [['ДАТА', '14.11.2026'], ['ВРЕМЯ', '22:40'], ['МЕСТО', 'Innocence Blvd, Strawberry']],
    narr: 'С соучастником ограбил магазин на Innocence Blvd, угрожая пистолетом, ранил продавца. Уехал на чёрном пикапе Bravado Bison.',
    contact: 'Дет.-сержант Raul Moreno, отдел расследований: 555-0142. В нерабочее время: Mission Row Station, 555-0100.' },
  b418: { name: 'Margaret Hall', unit: 'Vespucci Station · отдел по розыску пропавших', caseNo: 'Рапорт R-11020', wantedFor: 'Пропала 17.11.2026 утром. Может быть дезориентирована, нуждается в помощи.', mainCap: 'Фото предоставлено семьёй',
    facts: [['Пол, возраст', 'Женский, 71 год'], ['Рост', '160 см'], ['Волосы, глаза', 'Седые, короткие · голубые'], ['Одежда', 'Бежевое пальто, трость, очки'], ['Откликается', 'На имя «Мэгги»']],
    incident: [['ДАТА', '17.11.2026'], ['ВРЕМЯ', 'около 09:30'], ['МЕСТО', 'Vespucci Beach, у пирса']],
    narr: 'Ушла из дома утром и не вернулась. Может не помнить адрес и своё имя полностью. Если увидели — побудьте рядом, предложите воды и позвоните.',
    contact: 'Andrew Koval, Vespucci Station: 555-0133 (круглосуточно) или 911.' },
  b420: { unit: 'Paleto Bay Station · отдел расследований', caseNo: 'Дело LSSD-26-0117', wantedFor: 'За вооружённое ограбление банка Fleeca на Great Ocean Hwy', mainCap: 'Кадр с камеры банка, 13:52',
    facts: [['Пол, возраст', 'Мужской, 25–35 лет'], ['Рост', 'около 180 см'], ['Одежда', 'Синяя куртка, чёрная балаклава, перчатки'], ['Оружие', 'Пистолет'], ['Транспорт', 'Тёмный седан без номеров']],
    incident: [['ДАТА', '17.11.2026'], ['ВРЕМЯ', '13:52'], ['МЕСТО', 'Fleeca Bank, Great Ocean Hwy']],
    contact: 'Дет. Ellen Cho, LSSD Paleto Bay: 555-0185. Или позвоните 911.' },
  b419: { unit: 'Sandy Shores Station · отдел краж транспорта', caseNo: 'Рапорт R-11017', wantedFor: 'Угнан 17.11.2026 с парковки в Rockford Hills',
    facts: [['Марка', 'Pegassi Zentorno'], ['Цвет', 'Жёлтый'], ['Номер', '5ZEN771 (могут быть сняты)'], ['Приметы', 'Спойлер, карбоновые зеркала'], ['Последний раз', 'Route 68, Harmony · 06:40']],
    incident: [['ДАТА', '17.11.2026'], ['ВРЕМЯ', '02:15'], ['МЕСТО', 'Rockford Hills, парковка']],
    contact: 'Kevin Ortega, Sandy Shores: 555-0177. Или позвоните 911.' }
};
var GEO = [['Grove Street, Davis', 52, 75], ['Forum Dr, Strawberry', 47, 80], ['Davis Ave', 55, 84], ['Rockford Hills', 40, 74], ['Vespucci Beach', 24, 88], ['Del Perro', 30, 80], ['Mission Row', 60, 80], ['Downtown Los Santos', 62, 73], ['La Mesa', 72, 78], ['LSIA, аэропорт', 52, 94], ['Sandy Shores', 66, 42], ['Paleto Bay', 38, 8], ['Paleto Blvd', 34, 12], ['Grapeseed', 70, 28], ['Route 68, Harmony', 46, 46], ['Great Ocean Hwy', 18, 40], ['Mount Chiliad', 38, 18], ['Grand Senora Desert', 55, 55], ['Alamo Sea', 52, 37]];
function nearest(x, y) { var best = null, bd = 1e9; GEO.forEach(function (g) { var d = (g[1] - x) * (g[1] - x) + (g[2] - y) * (g[2] - y); if (d < bd) { bd = d; best = g; } }); return best ? best[0] : ''; }
var VID = { wanted: ['Разыскивается', 'red'], special: ['Особый розыск', 'red'], poi: ['Лицо, представляющее интерес', 'amber'], missing: ['Пропал без вести', 'blue'], alert: ['Оповещение населения', 'amber'] };
var VIDS = ['wanted', 'special', 'poi', 'missing', 'alert'];

var NEWC = [
  [ // 0 человек (известен)
    { t: 'Разыскивается', vid: 'wanted', hint: 'Обвиняется или подозревается: есть статья или ордер.', kind: 'person', rec: ['Daniel Reyes · CIT-60214', 'Фото, рост, приметы и транспорт подставлены из личного дела'], pc: { '306': true }, armed: false, armedOk: true, prio: 1,
      desc: 'Мужчина, 31 год, 175 см, плотный. Татуировка на левом предплечье, чёрная кепка, светлая толстовка. На записи камеры парковки садится в Zentorno.', place: 'Rockford Hills, камера парковки · 17.11, 02:15', instr: 'Задержать для допроса по угону, доставить в Mission Row. Сообщить автору.',
      photos: [['Из личного дела', 'mug'], ['Камера парковки · 02:15', 'cam']], links: ['Ориентировка B-0419 · Zentorno', '+ Ордер', '+ Дело'], extra: [],
      radio: 'Всем экипажам, ориентировка, %P приоритет: Daniel Reyes, мужчина, 31 год, 175 см, татуировка на левом предплечье, чёрная кепка. Подозревается в угоне жёлтого Zentorno, последний раз Rockford Hills.' },
    { t: 'Особый розыск', vid: 'special', hint: 'Опасен или очень важен: метка в рации, всплывает у всех на смене со звуком.', kind: 'person', rec: ['Tyrone Webb · CIT-48812', 'Фото, рост, приметы, адреса и банда подставлены из личного дела'], pc: { '216': true, '207': true }, armed: true, armedOk: true, prio: 2,
      desc: 'Чёрный мужчина, 28 лет, 188 см, крепкий. Татуировка «FDB» на шее, шрам на правой руке. Часто в чёрной худи и красной бандане.', place: 'Davis Ave / Grove St · 17.11, 11:05', instr: 'Не задерживать в одиночку. Вызвать минимум два экипажа, доложить на канале 1 и Дет.-сержанту Raul Moreno.',
      photos: [['Из личного дела', 'mug'], ['Татуировка FDB на шее', 'tattoo'], ['Камера · 1207 Grove St', 'cam']], links: ['Ордер W-2231 · арест', 'Дело SW-2611', '+ Ориентировка'], extra: [['Ордер', 'W-2231 · арест, судья Eleanor Harper'], ['Банда', 'Forum Drive Boys · лидер']],
      radio: 'Всем экипажам, особый розыск: Tyrone Webb, 28 лет, 188 см, татуировка FDB на шее. Вооружён и опасен, ордер на арест. Не задерживать в одиночку, сообщить на канал 1.' },
    { t: 'Лицо, представляющее интерес', vid: 'poi', hint: 'Не обвиняется, но нужен для разговора: свидетель, возможный участник. Не задерживать.', kind: 'person', rec: ['Lee Han · CIT-50731', 'Фото и адрес подставлены из личного дела'], pc: {}, pcOffText: 'Статья не нужна: человек не обвиняется.', armed: false, armedOk: false, prio: 0,
      desc: 'Мужчина, 45 лет, 170 см, худой, седые короткие волосы, очки. Обычно в сером пиджаке.', place: 'Innocence Blvd, магазин 24/7 · 08.11, 22:40', instr: 'Не задерживать. Попросить связаться с Дет.-сержантом Raul Moreno, записать телефон и адрес.',
      photos: [['Из личного дела', 'mug']], links: ['Дело LS-2026-0893', '+ Ориентировка'], extra: [['Зачем нужен', 'Свидетель ограбления магазина 24/7'], ['Как связаться', 'Телефон не отвечает, дома не застали']],
      radio: 'Всем экипажам: ищем для разговора Lee Han, 45 лет, очки, серый пиджак. Свидетель по делу LS-2026-0893, не задерживать, попросить позвонить Дет.-сержанту Moreno.' },
    { t: 'Пропал без вести', vid: 'missing', hint: 'Человек пропал, ищем, чтобы помочь. Статья и метка «вооружён» не нужны.', kind: 'missing', rec: ['Margaret Hall · CIT-41290', 'Фото и приметы подставлены из личного дела и заявления'], pc: {}, pcOffText: 'Статья не нужна: человек пропал, а не обвиняется.', armed: false, armedOk: false, prio: 1,
      desc: 'Женщина, 71 год, 160 см, седые короткие волосы, очки. Бежевое пальто, ходит с тростью. Откликается на имя «Мэгги».', place: 'Vespucci Beach, у пирса · 17.11, 09:30', instr: 'Говорить спокойно, предложить воды. Сообщить диспетчеру и дочери по телефону 555-0182.',
      photos: [['Фото от дочери', 'mug'], ['Пальто и трость', 'obj']], links: ['Заявление R-11020', '+ Дело'], extra: [['Состояние', 'Может быть дезориентирована, нужны лекарства'], ['Кто заявил', 'Дочь, Anna Hall · 555-0182']],
      radio: 'Всем экипажам: пропала Margaret Hall, 71 год, бежевое пальто, трость. Может быть дезориентирована. Последний раз Vespucci Beach. При обнаружении сообщить диспетчеру.' }
  ],
  [ // 1 неизвестный
    { t: 'Розыск по приметам', vid: 'wanted', hint: 'Личность неизвестна, но человек подозревается: описываем по приметам и кадрам.', kind: 'unknown', rec: null, recSub: 'Личность не установлена. Опишите приметы ниже и приложите кадр с камеры.', pc: { '216': true }, armed: true, armedOk: true, prio: 2,
      desc: 'Мужчина, 25–35 лет, около 180 см. Синяя куртка, чёрная балаклава, перчатки. Был с чёрной спортивной сумкой.', place: 'Fleeca Bank, Great Ocean Hwy · 17.11, 13:52', instr: 'Вооружён. Не преследовать в одиночку, сообщить диспетчеру и держать дистанцию.',
      photos: [['Камера банка · 13:52', 'cam'], ['Сумка у банка', 'obj']], links: ['Вызов #4502', 'Дело LSSD-26-0117', '+ Ориентировка'], extra: [['Транспорт', 'Тёмный седан без номеров'], ['Куда уехал', 'На север, в сторону Paleto Bay']],
      radio: 'Всем экипажам: неизвестный в балаклаве, синяя куртка, около 180 см. Вооружённое ограбление Fleeca Bank на Great Ocean Hwy. Тёмный седан без номеров, на север.' },
    { t: 'Помогите опознать', vid: 'poi', tpl: 'identify', hint: 'Человек есть, но кто он — неизвестно: найден без документов или попал на камеру.', kind: 'unknown', rec: null, recSub: 'Личность не установлена. Приложите фото, чтобы его узнали.', pc: {}, pcOffText: 'Статья не нужна: нужно только установить личность.', armed: false, armedOk: false, prio: 0,
      desc: 'Мужчина, около 60 лет, 175 см, седая борода. Синяя рабочая куртка, на руке часы с гравировкой «R.M.».', place: 'Пирс Del Perro · 18.11, 06:10', instr: 'Если узнали — сообщить в больницу Pillbox Hill или Дет. Ellen Cho, 555-0185.',
      photos: [['Фото из больницы', 'mug']], links: ['Рапорт R-11048', '+ Дело'], extra: [['Где сейчас', 'Больница Pillbox Hill, палата 4'], ['Что известно', 'Найден у пирса Del Perro, не помнит имени']],
      radio: 'Всем экипажам: помогите опознать мужчину около 60 лет с седой бородой, найден у пирса Del Perro, сейчас в Pillbox Hill. Кто узнает — сообщить диспетчеру.' }
  ],
  [ // 2 транспорт
    { t: 'Розыск по делу', vid: 'wanted', hint: 'Машина связана с преступлением: на ней скрылись, перевозят оружие, нужна для осмотра.', kind: 'veh', rec: ['Bravado Bison · 87PLN903', 'Из DMV: чёрный пикап, владелец Tyrone Webb'], car: true, pc: { '702': true }, armed: true, armedOk: true, armedLabelV: 'В машине могут быть вооружены', prio: 2,
      desc: 'Чёрный пикап Bravado Bison 2016, тонированные стёкла, хромированные диски, вмятина сзади слева.', place: 'Forum Dr 14, Strawberry · 16.11, 23:40', instr: 'Остановка высокого риска. Дождаться второго экипажа, водителя и пассажиров выводить по одному.',
      photos: [['Камера · Forum Dr', 'car'], ['Вмятина сзади слева', 'car']], links: ['Ориентировка B-0412 · Webb', 'Дело SW-2611', '+ Ордер'], extra: [['Владелец', 'Tyrone Webb · в особом розыске'], ['Связано с', 'Перевозка оружия, дело SW-2611']],
      radio: 'Всем экипажам: розыск чёрного пикапа Bravado Bison, номер 87PLN903. Может перевозить оружие, остановка высокого риска, ждать второй экипаж.' },
    { t: 'Угон', vid: 'wanted', tpl: 'stolen', hint: 'Машину угнали, владелец заявил. Если нашли без людей — сообщить и дождаться эвакуатора.', kind: 'veh', rec: ['Pegassi Zentorno · 5ZEN771', 'Из DMV: жёлтый, владелец Lee Han'], car: true, dup: true, pc: { '306': true }, armed: false, armedOk: false, prio: 1,
      desc: 'Жёлтый суперкар Pegassi Zentorno, спойлер, карбоновые зеркала. Номера могут быть сняты.', place: 'Rockford Hills, парковка · 17.11, 02:15', instr: 'Остановить, проверить водителя. Если машина пустая — сообщить и дождаться эвакуатора, ничего не трогать.',
      photos: [['Камера парковки · 02:15', 'cam']], links: ['Заявление R-11017', '+ Дело'], extra: [['Владелец', 'Lee Han · заявил 17.11, 03:10'], ['Когда угнана', '17.11, около 02:15']],
      radio: 'Всем экипажам: угнан жёлтый Pegassi Zentorno, номер 5ZEN771, может быть без номеров. Угнан из Rockford Hills ночью.' }
  ],
  [ // 3 событие
    { t: 'Происшествие', vid: 'alert', hint: 'Наводнение, пожар, утечка газа, перекрытия: что случилось и что делать жителям.', kind: 'event', rec: null, pc: {}, armed: false, armedOk: false, prio: 1, desc: '', place: '', instr: '', photos: [], links: [], extra: [],
      radio: 'Всем экипажам: оповещение населения, подтопление в Vespucci и Del Perro. Перекрыты Prosperity St и Magellan Ave. Убежище в школе Vespucci, помогаем с эвакуацией.' },
    { t: 'Бюллетень безопасности', vid: 'alert', tpl: 'bulletin', hint: 'Тенденция преступлений в районе и советы жителям: как не стать жертвой.', kind: 'event', bulletin: true, rec: null, pc: {}, armed: false, armedOk: false, prio: 1, desc: '', place: '', instr: '', photos: [], links: [], extra: [],
      radio: 'Всем экипажам: бюллетень безопасности, грабежи с преследованием до дома в Rockford Hills и Vinewood. Обращать внимание на машины, которые едут за людьми от бутиков и клубов.' }
  ]
];
var BULRECS = ['Будьте внимательны, выходя из машины, ресторана, магазина или клуба: замечайте всё необычное.', 'Не показывайте дорогие вещи на улице: часы, украшения, сумки.', 'Запоминайте и сообщайте о подозрительных людях и машинах: приметы, номер, цвет.', 'Если за вами едут — звоните 911 и езжайте к ближайшему участку, не домой.', 'Если вас грабят — не сопротивляйтесь, отдайте вещи и постарайтесь всё запомнить.', 'Сразу после грабежа звоните 911 и запишите всё, что помните о преступниках и машине.', 'Не преследуйте грабителя сами — оставьте это полиции.'];
var NOBJ = [['Человек', 'известен', 'M10 9a3.2 3.2 0 100-6.4A3.2 3.2 0 0010 9zM3.5 17.5c0-3.6 2.9-6 6.5-6s6.5 2.4 6.5 6'], ['Неизвестный', 'по приметам', 'M7.5 7.5a2.5 2.5 0 115 .5c0 1.5-2.5 2-2.5 3.5M10 14.5h.01M10 18a8 8 0 100-16 8 8 0 000 16z'], ['Транспорт', 'машина, мото', 'M3 13v-3l2-4h10l2 4v3zM3 13v2h2v-2M15 13v2h2v-2'], ['Событие', 'для жителей', 'M3 8v4h3l6 4V4L6 8zM15 7.5a3.5 3.5 0 010 5']];
var PCN = { '207': 'Нападение со смертоносным оружием', '215': 'Ограбление', '216': 'Вооружённое ограбление', '302': 'Кража со взломом', '304': 'Крупная кража', '306': 'Угон транспортного средства', '313': 'Кража регистрационных знаков', '702': 'Хранение запрещённого огнестрельного оружия' };
var ACCS = [['Все агентства', 'LSPD, LSSD, SAHP, FIB видят и получают уведомление'], ['Только LSPD', 'Другие агентства не видят карточку'], ['Отдел расследований', 'Видят детективы. Патруль при пробивке номера видит только «есть закрытая ориентировка» и контакт'], ['Выбранные сотрудники', 'Только те, кого вы добавите']];
var CTS = [['', '', '555-0121', 'Я'], ['Дет.-сержант Raul Moreno', 'LSPD · отдел расследований', '555-0142', 'Ведёт дело'], ['Kevin Ortega', 'LSSD · Sandy Shores', '555-0177', 'Автор B-0419']];
var ASSET = {"plate-sa": "/assets/bolo/aeec39e3277b294b2374a61e4c82c77e.png", "dealerplate-california": "/assets/bolo/fdd301fdb07803c32ff198bc4941a9ae.otf", "logo-lspd": "/assets/bolo/45c489eca07290dce77f5ba9125d4868.png", "logo-lssd": "/assets/bolo/bce88aa0f0b36efc819d63ae60d246eb.png", "logo-coroner": "/assets/bolo/6dba74a643ce45be4ed8e8f813f988d5.png", "logo-sadocr": "/assets/bolo/6f54348af7d27b1024003aa0a32ac9e4.png", "seal-city": "/assets/bolo/058edb0cf660a661d66b6ee66781369e.png", "seal-city-bw": "/assets/bolo/d701c48079be774fa1f1f5e5296c1934.png", "seal-county": "/assets/bolo/1962b8787fd085eb06bb9e025b029b41.png", "seal-county-bw": "/assets/bolo/c838b79d24075e14fb203587d3804b94.png", "seal-state": "/assets/bolo/825788c8508b978ce522fadd12971f1e.png", "seal-state-bw": "/assets/bolo/33bdb1c12816331010abe6a2726d3edc.png"};
var EVENTS = [
  { id: 'e423', vid: 'alert', pc: [], ct: ['Отдел ограблений LSPD', 'Rockford Hills', '555-0144'], photos: [], src: 'lspd', no: 'B-0423', kind: 'event', bulletin: true, prio: 'mid', armed: false, status: 'open', title: 'Грабежи с преследованием до дома', sub: 'Rockford Hills, Vinewood, Burton', reason: 'БЮЛЛЕТЕНЬ БЕЗОПАСНОСТИ', reasonTone: 'red',
    facts: [['Зона', 'Rockford Hills, Vinewood'], ['Действует до', 'До отмены']], desc: '', tags: [], instr: '', links: [], seen: [], ack: [0, 52], author: 'Капитан D. Hayes', created: '20.11, 10:00', ago: '1 д', unread: false },
  { id: 'e422', vid: 'alert', pc: [], ct: ['Штаб по ЧС', 'Los Santos · Emergency', '311'], photos: [], src: 'lspd', no: 'B-0422', kind: 'event', prio: 'high', armed: false, status: 'open', title: 'Подтопление в Vespucci', sub: 'Ливень, вода вышла из каналов', reason: 'ШТОРМОВОЕ ПРЕДУПРЕЖДЕНИЕ', reasonTone: 'amber',
    facts: [['Зона', 'Vespucci, Del Perro'], ['Действует до', '19.11, 08:00']], desc: 'Подтопление улиц после ливня.', tags: [], instr: 'Перекрыть въезд на Prosperity St и Magellan Ave, помочь с эвакуацией в школу Vespucci.',
    links: [], seen: [], ack: [0, 52], author: 'Штаб по ЧС', created: '18.11, 06:40', ago: '1 ч', unread: false }
];
var BOLOS = [
  { id: 'b412', vid: 'special', pc: ["216", "207"], ct: ["Дет.-сержант Raul Moreno", "LSPD · отдел расследований", "555-0142"], photos: [['Из личного дела', 'mug'], ['Татуировка FDB на шее', 'tattoo'], ['Камера · 1207 Grove St', 'cam']], src: 'lspd', no: 'B-0412', kind: 'person', prio: 'high', armed: true, status: 'open', title: 'Tyrone Webb', sub: 'CIT-48812 · лидер Forum Drive Boys', reason: 'ОРДЕР НА АРЕСТ W-2231', reasonTone: 'red',
    facts: [['Пол, возраст', 'Мужчина, 28 лет'], ['Рост, телосложение', '188 см, крепкое'], ['Волосы, глаза', 'Короткие чёрные, карие'], ['Зона', 'Весь округ'], ['Действует до', '22.11, 23:59'], ['Транспорт', 'Bravado Bison 87PLN903', 'b415']],
    desc: 'Чёрный мужчина, крепкого телосложения. Часто в чёрной худи и красной бандане. Ходит с пистолетом за поясом, при задержании в 2025 году оказал сопротивление.', tags: ['Татуировка «FDB» на шее', 'Красная бандана', 'Шрам на правой руке'],
    instr: 'Не задерживать в одиночку. Вызвать минимум два экипажа, доложить на канале 1 и Дет.-сержанту Raul Moreno.',
    links: [['Личное дело', 'Tyrone Webb · CIT-48812', 'person'], ['Дом', '1207 Grove Street', 'home'], ['Транспорт', 'Bison 87PLN903 · BOLO B-0415', 'bolo'], ['Ордер', 'W-2231 · арест, Eleanor Harper', 'doc'], ['Дело', 'SW-2611 · оружие на Grove St', 'case'], ['Банда', 'Forum Drive Boys', 'org']],
    seen: [['1207 Grove Street', '15.11, 21:12', 'Стоял у гаража, рядом Bison 87PLN903.', 'Thomas Watts', 52, 74], ['Forum Dr 14, Strawberry', '16.11, 23:40', 'Вышел из Bison, зашёл в подъезд.', 'Devin Lanier', 47, 80], ['Davis Ave / Grove St', '17.11, 11:05', 'Пешком, направлялся на юг.', 'Carlos Mendez', 55, 84]],
    ack: [38, 52], author: 'Дет.-сержант Raul Moreno', created: '15.11, 10:40', ago: '2 дн', unread: false,
    updNew: ['17.11, 12:30', 'Особый розыск вместо «Разыскивается», добавлена статья PC 207, новое фото татуировки.'], updDraft: 'Видели на тёмно-зелёном Karin Sultan без номеров, на Bison больше не ездит.',
    hist: [['15.11, 10:40', 'Raul Moreno', 'Создана · Разыскивается, PC 216'], ['16.11, 09:15', 'Raul Moreno', 'Добавлено фото: камера у 1207 Grove St'], ['17.11, 12:30', 'Raul Moreno', 'Особый розыск вместо «Разыскивается», добавлена PC 207, фото татуировки']] },
  { id: 'b415', vid: 'wanted', pc: ["702"], ct: ["Дет.-сержант Raul Moreno", "LSPD · отдел расследований", "555-0142"], photos: [['Камера · Forum Dr', 'car'], ['Вмятина сзади слева', 'car']], src: 'lspd', no: 'B-0415', kind: 'veh', prio: 'high', armed: false, status: 'open', title: 'Bravado Bison', plate: '87PLN903', carColor: '#2A2A2A', sub: '87PLN903 · чёрный пикап', reason: 'ПЕРЕВОЗКА ОРУЖИЯ', reasonTone: 'red',
    facts: [['Номер', '87PLN903'], ['Цвет', 'Чёрный'], ['Владелец', 'Tyrone Webb', 'person'], ['Зона', 'Los Santos'], ['Действует до', '17.11, 20:00'], ['Особенности', 'Тонировка, хром-диски']],
    desc: 'Чёрный пикап Bravado Bison, тонированные стёкла, хромированные диски, вмятина на заднем левом крыле. В кузове может быть оружие.', tags: ['Тонировка', 'Вмятина сзади слева', 'Хром-диски'],
    instr: 'Остановка высокого риска. Дождаться второго экипажа, водителя и пассажиров выводить по одному.',
    links: [['Карточка DMV', 'Bravado Bison 87PLN903', 'car'], ['Владелец', 'Tyrone Webb · BOLO B-0412', 'bolo'], ['Где стоит', '1207 Grove Street', 'home'], ['Дело', 'SW-2611 · оружие на Grove St', 'case']],
    seen: [['1207 Grove Street', '15.11, 21:12', 'Припаркован у гаража.', 'Thomas Watts', 52, 74], ['Forum Dr 14, Strawberry', '16.11, 23:40', 'Высадил человека, уехал на восток.', 'Devin Lanier', 47, 80]],
    ack: [41, 52], author: 'Дет.-сержант Raul Moreno', created: '15.11, 10:42', ago: '2 дн', unread: false, expSoon: ['сегодня в 20:00', 'через 3 ч'],
    hist: [['15.11, 10:42', 'Raul Moreno', 'Создана · срок 2 дня'], ['17.11, 14:00', 'Система', 'Напоминание автору: истекает через 6 ч']] },
  { id: 'b420', vid: 'poi', pc: ["216"], ct: ["Дет. Ellen Cho", "LSSD · Paleto Bay, отдел расследований", "555-0185"], photos: [['Камера банка · 13:52', 'cam'], ['Сумка, бросил у банка', 'obj'], ['Седан · Paleto Blvd', 'car']], src: 'lssd', no: 'B-0420', kind: 'unknown', prio: 'high', armed: true, status: 'open', title: 'Неизвестный в балаклаве', sub: 'Ограбление Fleeca Bank, Great Ocean Hwy', reason: 'ОГРАБЛЕНИЕ FLEECA BANK', reasonTone: 'red',
    facts: [['Пол', 'Мужчина'], ['Рост', 'около 180 см'], ['Одежда', 'Синяя куртка, балаклава'], ['Зона', 'Paleto Bay, Sandy Shores'], ['Действует до', '19.11, 14:00'], ['Транспорт', 'Тёмный седан без номеров']],
    desc: 'Ограбил отделение Fleeca Bank на Great Ocean Hwy в 13:52. Угрожал пистолетом, ушёл с сумкой. Уехал на тёмном седане без номеров в сторону Paleto Bay.', tags: ['Синяя куртка', 'Чёрная спортивная сумка', 'Перчатки'],
    instr: 'Вооружён. Не преследовать в одиночку, сообщить диспетчеру и держать дистанцию.',
    links: [['Место', 'Fleeca Bank · Great Ocean Hwy', 'org'], ['Вызов', '#4502 · 10-31 ограбление', 'call'], ['Дело', 'LSSD-26-0117 · ограбление Fleeca', 'case']],
    seen: [['Fleeca Bank, Great Ocean Hwy', '17.11, 13:52', 'Место ограбления, свидетели в отделении.', 'Диспетчер', 18, 40], ['Paleto Blvd', '17.11, 14:20', 'Тёмный седан на большой скорости на север.', 'Lawrence Brooks (SAHP)', 34, 12]],
    ack: [12, 52], author: 'Дет. Ellen Cho', created: '17.11, 14:05', ago: '2 ч', unread: true },
  { id: 'b418', vid: 'missing', pc: [], ct: ["Andrew Koval", "LSPD · Vespucci", "555-0133"], photos: [['Фото от дочери', 'mug'], ['Пальто и трость', 'obj']], src: 'lspd', no: 'B-0418', kind: 'missing', prio: 'mid', armed: false, status: 'open', title: 'Margaret Hall', sub: 'Пропала без вести, 71 год', reason: 'ЗАЯВЛЕНИЕ РОДСТВЕННИКОВ', reasonTone: 'amber',
    facts: [['Пол, возраст', 'Женщина, 71 год'], ['Рост', '160 см'], ['Волосы', 'Седые, короткие'], ['Зона', 'Vespucci, Del Perro'], ['Действует до', 'До отмены'], ['Особенности', 'Может быть дезориентирована']],
    desc: 'Ушла из дома утром, может не помнить адрес. Была в бежевом пальто и с тростью. Реагирует на имя «Мэгги».', tags: ['Бежевое пальто', 'Трость', 'Очки'],
    instr: 'Говорить спокойно, предложить воды. Сообщить диспетчеру и дочери по телефону 555-0182.',
    links: [['Дом', 'Vespucci Canals, 18', 'home'], ['Заявление', 'Рапорт R-11020 · Andrew Koval', 'doc']],
    seen: [['Vespucci Beach', '17.11, 09:30', 'Последний раз видели соседи у пирса.', 'Заявление', 24, 88]],
    ack: [44, 52], author: 'Andrew Koval', created: '17.11, 11:15', ago: '5 ч', unread: true },
  { id: 'b419', vid: 'wanted', pc: ["306"], ct: ["Kevin Ortega", "LSSD · Sandy Shores", "555-0177"], photos: [['Камера парковки', 'cam']], src: 'lssd', no: 'B-0419', kind: 'veh', prio: 'mid', armed: false, status: 'open', title: 'Pegassi Zentorno', plate: '5ZEN771', carColor: '#E3B505', sub: '5ZEN771 · жёлтый, угнан', reason: 'УГОН', reasonTone: 'amber',
    facts: [['Номер', '5ZEN771'], ['Цвет', 'Жёлтый'], ['Владелец', 'Lee Han'], ['Зона', 'Весь округ'], ['Действует до', '24.11'], ['Угнан', '17.11, 02:15, Rockford Hills']],
    desc: 'Жёлтый суперкар, угнан с парковки в Rockford Hills. Возможно, номера уже сняты.', tags: ['Жёлтый', 'Спойлер', 'Без номеров?'],
    instr: 'Остановить, проверить водителя. Машину на штрафстоянку Mission Row.',
    links: [['Карточка DMV', 'Pegassi Zentorno 5ZEN771', 'car'], ['Заявление', 'Владелец Lee Han · рапорт R-11017', 'doc']],
    seen: [['Rockford Hills', '17.11, 02:15', 'Место угона, камера парковки.', 'Заявление владельца', 40, 74], ['Route 68, Harmony', '17.11, 06:40', 'Жёлтый суперкар без номеров на заправке, уехал на запад.', 'Kevin Ortega', 46, 46]],
    ack: [30, 52], author: 'Kevin Ortega', created: '17.11, 08:02', ago: '8 ч', unread: false },
  { id: 'b409', vid: 'wanted', pc: ["215"], ct: ["Дет.-сержант Raul Moreno", "LSPD · отдел расследований", "555-0142"], photos: [['Из личного дела', 'mug']], src: 'lspd', no: 'B-0409', kind: 'person', prio: 'high', armed: false, status: 'closed', title: 'Marcus Tate', sub: 'CIT-55120 · Go Postal', reason: 'ОГРАБЛЕНИЕ', reasonTone: 'grey',
    facts: [['Пол, возраст', 'Мужчина, 24 года'], ['Рост', '178 см'], ['Зона', 'Los Santos'], ['Создана', '08.11, 18:30'], ['Закрыта', '10.11, 14:20'], ['Транспорт', 'Declasse Premier 4FJT118']],
    desc: 'Худощавый, шрам на левой брови. Курьер Go Postal, ездил на белом Declasse Premier.', tags: ['Шрам на брови', 'Куртка Go Postal'],
    instr: 'Ориентировка закрыта, действий не требуется.',
    links: [['Личное дело', 'Marcus Tate · CIT-55120', 'person'], ['Дом', 'Forum Dr 14, Strawberry', 'home'], ['Транспорт', 'Declasse Premier 4FJT118', 'car'], ['Арест', 'A-2026-1187 · Mission Row', 'doc'], ['Дело', 'LS-2026-0893', 'case']],
    seen: [['Forum Dr 14, Strawberry', '10.11, 14:20', 'Задержан при обыске.', 'Andrew Koval', 47, 80]],
    ack: [52, 52], author: 'Дет.-сержант Raul Moreno', created: '08.11, 18:30', ago: '7 дн', unread: false, closedHow: 'Задержан', closedBy: 'Andrew Koval', closedAt: '10.11, 14:20' },
  { id: 'b402', vid: 'poi', pc: [], ct: ["Thomas Watts", "LSPD · Mission Row", "555-0121"], photos: [], src: 'lspd', no: 'B-0402', kind: 'veh', prio: 'low', armed: false, status: 'expired', title: 'Vapid Speedo', plate: '7XLM502', carColor: '#9AA0A6', sub: '7XLM502 · серый фургон', reason: 'ПРОВЕРИТЬ ВОДИТЕЛЯ', reasonTone: 'grey',
    facts: [['Номер', '7XLM502'], ['Цвет', 'Серый'], ['Владелец', 'Go Postal', 'org'], ['Зона', 'Los Santos'], ['Действовала до', '12.11'], ['Особенности', 'Логотип Go Postal']],
    desc: 'Фургон Go Postal, водитель мог перевозить посылки для Forum Drive Boys.', tags: ['Логотип Go Postal'], instr: 'Срок истёк.',
    links: [['Организация', 'Go Postal', 'org']], seen: [], ack: [49, 52], author: 'Thomas Watts', created: '05.11, 12:00', ago: '12 дн', unread: false }
];
// MDT: the reference draws its own stylised map; here it is the San Andreas
// map image (shared/sanAndreasMap). Its named places are the ones read off that
// image (same names), and every sighting is moved by its nearest named place.
var GEO_REF = GEO;
GEO = GEO_REF.map(function (g) { var s = SA_GEO.filter(function (p) { return p[0] === g[0]; })[0]; return [g[0], s[1], s[2]]; });
function toSA(x, y) {
  var bi = 0, bd = 1e9;
  GEO_REF.forEach(function (g, i) { var d = (g[1] - x) * (g[1] - x) + (g[2] - y) * (g[2] - y); if (d < bd) { bd = d; bi = i; } });
  var r = GEO_REF[bi], s = GEO[bi];
  return [+(s[1] + (x - r[1]) * 0.6).toFixed(1), +(s[2] + (y - r[2]) * 0.6).toFixed(1)];
}
BOLOS.concat(EVENTS).forEach(function (b) { b.seen.forEach(function (s) { var p = toSA(s[4], s[5]); s[4] = p[0]; s[5] = p[1]; }); });
/** MDT: the event form's texts and points as the reference fills them in (the fields are bound to state) */
var FPH = {"alTitle":"Подтопление в Vespucci","alDesc":"Сильный ливень: вода в каналах Vespucci поднялась выше набережной.","alTodo":"Не заходите в воду и не пытайтесь проехать по затопленной дороге. Отключите электричество, если вода в доме. Помогите пожилым соседям подняться на верхние этажи.","alCall":"911 — если в опасности · 311 — справки об убежищах и перекрытиях","bTitle":"Бюллетень безопасности","bSub":"Грабежи с преследованием до дома","bText":"Участились уличные грабежи: преступники выбирают жертву у бутиков на Portola Drive, в ночных клубах и дорогих ресторанах Vinewood, едут следом и грабят у дома или у бизнеса. Чаще всего забирают дорогие часы, украшения и сумки, выбирают и по машине.\n\nС начала ноября — 9 случаев в Rockford Hills, Vinewood и Burton. Задержаны несколько подозреваемых, но действуют разные группы.","bListT":"Что советуем жителям","bCt":"Отдел ограблений LSPD, Rockford Hills · 555-0144","bAppr":"Капитан D. Hayes, Rockford Hills Station"};
var FDEF = {}; Object.keys(FPH).forEach(function (k) { FDEF[k] = ''; });
var AL0 = [['Где', ''], ['Перекрыто', ''], ['Убежище', ''], ['Вода и еда', ''], ['Прогноз', '']];
// MDT: a person's photo comes from their MDC record (shared/personPhotos); without one — a neutral silhouette
var SIL = "data:image/svg+xml,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%2096%20112%22%3E%3Ccircle%20cx%3D%2248%22%20cy%3D%2240%22%20r%3D%2221%22%20fill%3D%22%236B717B%22%2F%3E%3Cpath%20d%3D%22M10%20112c0-25%2017-41%2038-41s38%2016%2038%2041z%22%20fill%3D%22%236B717B%22%2F%3E%3C%2Fsvg%3E";
BOLOS.forEach(function (b) { if ((b.kind === 'person' || b.kind === 'missing') && !b.mainImg) { var r = SEARCH_DB.filter(function (d) { return d.type === 'person' && d.title === b.title; })[0]; b.mainImg = ownPhoto(r ? r.id : null, b.title) || ''; } });
PHIMG.mug = '';
// MDT: Russian plural — plRu(21, 'ориентировка', 'ориентировки', 'ориентировок')
// MDT: uncertainty radius in % of the map height (presets «Точно» / «~200 м» / «Район», or any value from the slider)
var ACC_R = [0, 1.7, 6], M_PER_PCT = 118;
function accTxt(r) { if (!r || r <= 0) return ''; var m = Math.round(r * M_PER_PCT / 50) * 50; return ' · ±' + (m >= 1000 ? (m / 1000).toFixed(1).replace('.0', '') + ' км' : Math.max(50, m) + ' м'); }
// MDT: «Обновить» — what each «Что изменилось» chip edits, and applying the edits to the record
function UPDW(x) { return x.kind === 'event' ? (x.bulletin ? ['Текст', 'Рекомендации', 'Районы', 'Контакты'] : ['Пункты', 'Уровень опасности', 'Что делать жителям', 'Зона']) : x.kind === 'veh' ? ['Фото', 'Номер или приметы машины', 'Последнее место', 'Инструкция', 'Основание или статья'] : ['Фото', 'Транспорт', 'Последнее место', 'Приметы', 'Инструкция', 'Основание или статья']; }
function UPDK(x) { return x.kind === 'event' ? (x.bulletin ? ['desc', 'instr', 'zone', null] : [null, null, 'instr', 'zone']) : x.kind === 'veh' ? ['photo', 'plate', 'place', 'instr', 'basis'] : ['photo', 'veh', 'place', 'desc', 'instr', 'basis']; }
function factOf(x, k) { var f = (x.facts || []).filter(function (r) { return r[0] === k; })[0]; return f ? f[1] : ''; }
function applyUpd(x, E) {
  function setFact(k, v) { x.facts = x.facts || []; var f = x.facts.filter(function (r) { return r[0] === k; })[0]; if (f) f[1] = v; else { var at = x.facts.findIndex(function (r) { return r[0] === 'Действует до'; }); x.facts.splice(at < 0 ? x.facts.length : at, 0, [k, v]); } }
  var done = [];
  if (E.desc != null && E.desc.trim() !== (x.desc || '')) { x.desc = E.desc.trim(); done.push(x.kind === 'veh' ? 'приметы машины' : x.kind === 'event' ? 'текст' : 'приметы'); }
  if (E.tags != null) { var tg = E.tags.split(',').map(function (s) { return s.trim(); }).filter(Boolean); if (tg.join('|') !== (x.tags || []).join('|')) { x.tags = tg; done.push('особые приметы'); } }
  if (E.instr != null && E.instr.trim() !== (x.instr || '')) { x.instr = E.instr.trim(); done.push('инструкция'); }
  if (E.veh != null && E.veh.trim() && E.veh.trim() !== factOf(x, 'Транспорт')) { setFact('Транспорт', E.veh.trim()); done.push('транспорт: ' + E.veh.trim()); }
  if (E.place != null && E.place.trim() && E.place.trim() !== factOf(x, 'Последнее место')) { setFact('Последнее место', E.place.trim()); done.push('последнее место: ' + E.place.trim()); }
  if (E.zone != null && E.zone.trim()) { var zk = x.kind === 'event' && factOf(x, 'Где') ? 'Где' : 'Зона'; if (E.zone.trim() !== factOf(x, zk)) { setFact(zk, E.zone.trim()); done.push('зона: ' + E.zone.trim()); } }
  if (E.plate != null && E.plate.trim()) { var np = E.plate.trim().toUpperCase().replace(/\s+/g, ''); if (np !== x.plate) { if (x.plate) x.sub = String(x.sub || '').replace(x.plate, np); x.plate = np; setFact('Номер', np); done.push('номер ' + np); } }
  if (E.vid != null && E.vid !== x.vid) { x.vid = E.vid; done.push('основание: ' + VID[E.vid][0].toLowerCase()); }
  if (E.pc != null) { var pc = E.pc.split(/[\s,;]+/).map(function (s) { return s.replace(/^PC/i, ''); }).filter(Boolean); if (pc.join(',') !== (x.pc || []).join(',')) { x.pc = pc; done.push('статьи ' + (pc.length ? pc.map(function (s) { return 'PC ' + s; }).join(', ') : 'сняты')); } }
  if (E.photo) done.push('фото');
  return done;
}
// MDT: an added photo is a URL or { url, cap } — the caption given when it was added
function photoUrl(u) { return typeof u === 'string' ? u : (u && u.url) || ''; }
function photoCap(u, d) { return u && typeof u === 'object' && u.cap ? u.cap : d; }
// MDT: «me» = the active character; the design's «Thomas Watts» is the first character's own BOLOs
function ME() { return mockProfile.name; }
function isMe(n) { return n === mockProfile.name || (mockProfile.id === 'acc1' && n === 'Thomas Watts'); }
Object.defineProperty(CTS, 0, { get: function () { return [mockProfile.name, (mockProfile.agencyShort || 'LSSD') + ' · ' + (mockProfile.station || ''), '555-0121', 'Я']; } });
function plRu(n, one, few, many) { var a = Math.abs(n) % 100, b = a % 10; return a > 10 && a < 20 ? many : b === 1 ? one : b > 1 && b < 5 ? few : many; }
/** «Где я сейчас»: the officer's GPS position (Grove Street) */
var GPS = { x: 46.5, y: 76.5 };
var ICN = { home: 'M3 9.5L10 3.5l7 6M5 8v8.5h10V8M8.5 16.5v-4h3v4', person: 'M10 9a3.2 3.2 0 100-6.4A3.2 3.2 0 0010 9zM3.5 17.5c0-3.6 2.9-6 6.5-6s6.5 2.4 6.5 6', car: 'M3 13v-3l2-4h10l2 4v3zM3 13v2h2v-2M15 13v2h2v-2M6 10.5h.5M13.5 10.5h.5', doc: 'M5 2.5h7l3 3v12H5zM8 9h4M8 12h4M8 15h2', case: 'M2.5 6h15v10.5h-15zM7 6V4h6v2M2.5 10h15', bolo: 'M10 3.5a6.5 6.5 0 100 13 6.5 6.5 0 100-13zM10 8a2 2 0 100 4 2 2 0 100-4z', org: 'M3 17h14M5 17V8l5-4 5 4v9M8 17v-4h4v4', call: 'M5 3h3l1.5 4-2 1.2a9 9 0 004.3 4.3L13 10.5l4 1.5v3a2 2 0 01-2 2A12.5 12.5 0 013 5a2 2 0 012-2z',
  list: 'M7 5h10M7 10h10M7 15h10M3 5h.01M3 10h.01M3 15h.01', flame: 'M10 17.5c3 0 5-2 5-5 0-3.5-3-5-3-9-2 1-4.5 3.5-4 6.5-1-.5-1.5-1.5-1.5-2.5C5 9 5 10.5 5 12.5c0 3 2 5 5 5z', help: 'M10 17.5a7.5 7.5 0 100-15 7.5 7.5 0 000 15zM7.8 7.8a2.3 2.3 0 114.4 1c-.5.9-2.2 1.3-2.2 2.7M10 14h.01', me: 'M10 9a3.2 3.2 0 100-6.4A3.2 3.2 0 0010 9zM3.5 17.5c0-3.6 2.9-6 6.5-6s6.5 2.4 6.5 6M14 4l1.5 1.5L18 3', pin: 'M10 17.5s-5.5-5-5.5-9a5.5 5.5 0 0111 0c0 4-5.5 9-5.5 9zM10 6.5a2 2 0 100 4 2 2 0 100-4z', map: 'M2.5 5l5-2 5 2 5-2v12l-5 2-5-2-5 2zM7.5 3v12M12.5 5v12', check: 'M4 10.5l3.5 3.5L16 5.5', clock: 'M10 17.5a7.5 7.5 0 100-15 7.5 7.5 0 000 15zM10 6v4l2.5 1.5' };

var __PLRE = /\b\d{1,2}[A-Z]{3}\d{3}\b/g;
function __plp(s) { var out = [], last = 0, m; __PLRE.lastIndex = 0; while ((m = __PLRE.exec(s))) { if (m.index > last) out.push({ t: s.slice(last, m.index), a: true, b: false }); out.push({ t: m[0], a: false, b: true }); last = m.index + m[0].length; } if (last < s.length || !out.length) out.push({ t: s.slice(last), a: true, b: false }); return out; }
function __pl(o, K) { var seen = new Set(); (function w(x, d) { if (!x || typeof x !== 'object' || d > 9 || seen.has(x)) return; seen.add(x); if (Array.isArray(x)) { x.forEach(function (y) { w(y, d + 1); }); return; } Object.keys(x).forEach(function (k) { var v = x[k]; if (typeof v === 'string' && K[k]) x[k + 'P'] = __plp(v); else if (v && typeof v === 'object' && typeof v !== 'function') w(v, d + 1); }); })(o, 0); return o; }
class Component extends DCLogic {
  constructor(props) {
    super(props);
    var v = props.view || 'feed';
    this.state = { view: v === 'seen' || v === 'close' || v === 'notify' || v === 'update' || v === 'arrested' || v === 'menu' ? 'feed' : (v === 'pick' || v === 'picked' || v === 'placed' || v === 'dup') ? 'new' : v === 'pickmap' ? 'map' : v, sel: props.sel || 'b412', nav: props.nav || 'active', q: '', acked: {}, extraSeen: {}, closed: {},
      dlg: v === 'seen' ? 'seen' : v === 'close' ? 'close' : v === 'update' ? 'update' : null, menu: v === 'menu', arrest: v === 'arrested', updWhat: { 1: true }, updText: null, updNotify: true, updReack: false, updated: {}, ext: {}, seenUpd: {}, nDup: v === 'dup', nAcc: 0, dir: 1, how: { 0: true }, backup: false, closeWhy: 0, toast: null, mapF: 'all',
      src: props.src || 'all', pick: v === 'pick' || v === 'picked' ? 'new' : (v === 'pickmap' ? 'map' : null), pin: v === 'picked' ? { x: 39.5, y: 73.5 } : (v === 'pickmap' ? { x: 53, y: 82 } : null), acc: 1, nPlace: v === 'placed' ? { x: 39.5, y: 73.5, acc: 1 } : null, seenPin: null, addedPhoto: {}, nPhotoN: 2, poster: { tpl: props.ptpl || null, photos: true, desc: true, reward: false, rewardSum: '$5 000', contact: true, qr: true, bw: false }, notif: 0, incoming: v === 'notify', created: false, nType: v === 'dup' ? 1 : 0, nReason: 1, nVid: 0, nObj: props.nobj != null ? +props.nobj : (v === 'dup' ? 2 : 0), nBas: props.nbas != null ? +props.nbas : (v === 'dup' ? 1 : 0), nPc: {}, nCt: 0, nPcQ: '', nPrio: 1, armed: false, nTerm: (function () { var o = props.nobj != null ? +props.nobj : 0, b = props.nbas != null ? +props.nbas : 0, cb = (NEWC[o] || [])[b] || {}; return cb.kind === 'event' ? (cb.bulletin ? 3 : 0) : cb.kind === 'missing' ? 3 : 2; })(), nZone: { 1: true }, nSend: { 0: true, 1: true } };
  }
  renderVals() { return __pl(this.__rv(), {'desc': true, 'last': true, 'narr': true, 'sub': true, 'subtitle': true, 'summary': true, 'text': true, 'v': true}); }
  __rv() {
    var self = this, S = this.state;
    var dark = this.props.dark !== false;
    var c = dark
      ? { mica: '#1D2027', frame: '#3B3B3B', content: '#272727', card: '#303030', btn: '#3A3A3A', search: 'rgba(255,255,255,0.06)', stroke: '#3A3A3A', stroke2: '#555555', text: '#FFFFFF', text2: '#C2C2C2', sel: 'rgba(255,255,255,0.08)', link: '#8FD8FF', flyout: '#2C2C2C', track: 'rgba(255,255,255,0.1)', rail: '#242424', field: 'rgba(255,255,255,0.06)', dialog: '#2B2B2B', dialogFoot: '#202020',
          mug: '#3A3F47', mugLine: 'rgba(255,255,255,0.07)', mugFig: 'rgba(255,255,255,0.16)', photoSky: '#36414E', photoGround: '#2A2F35', map: '#26303A', mapWater: '#132536', mapHill: '#2B3640', mapDesert: '#3A3528', mapCity: '#2E3843', mapRoad: '#4A5C70', mapLabel: '#9FB0C2' }
      : { mica: '#EEF2F8', frame: '#D0D5DC', content: '#F7F7F7', card: '#FFFFFF', btn: '#EAEAEA', search: '#FFFFFF', stroke: '#E5E5E5', stroke2: '#C8C8C8', text: '#1B1B1B', text2: '#5C5C5C', sel: 'rgba(0,0,0,0.06)', link: '#005FB8', flyout: '#FCFCFC', track: 'rgba(0,0,0,0.08)', rail: '#F0F0F0', field: '#FFFFFF', dialog: '#FFFFFF', dialogFoot: '#F3F3F3',
          mug: '#D5D9DF', mugLine: 'rgba(0,0,0,0.06)', mugFig: 'rgba(0,0,0,0.18)', photoSky: '#CBD5E1', photoGround: '#AEB7C2', map: '#E9EEE6', mapWater: '#BFD7EA', mapHill: '#DCE4D6', mapDesert: '#EFE6CF', mapCity: '#DDE2E8', mapRoad: '#A9B6C4', mapLabel: '#4A5868' };
    var TN = dark
      ? { red: ['rgba(232,17,35,0.2)', '#FF99A4'], amber: ['rgba(255,185,0,0.16)', '#FCE100'], green: ['rgba(16,124,16,0.28)', '#6CCB5F'], grey: ['rgba(255,255,255,0.08)', '#C8C8C8'], blue: ['rgba(0,120,212,0.25)', '#99D9FF'] }
      : { red: ['#FDE7E9', '#A4262C'], amber: ['#FFF4CE', '#7A4A00'], green: ['#DFF6DD', '#0E6A0E'], grey: ['#EFEFEF', '#5C5C5C'], blue: ['#E3F0FB', '#00508F'] };
    var accent = this.props.accent && this.props.accent !== '#005FB8' ? this.props.accent : (dark ? '#60CDFF' : '#005FB8');
    var onAccent = (dark && accent === '#60CDFF') ? '#000000' : '#FFFFFF';
    function toast(k) { self.setState({ toast: k }); clearTimeout(self._t); self._t = setTimeout(function () { self.setState({ toast: null }); }, 4000); }
    function chip(t, tone) { return { t: t, bg: TN[tone][0], fg: TN[tone][1] }; }
    var PRIO = { high: ['Высокий', 'red'], mid: ['Средний', 'amber'], low: ['Низкий', 'grey'] };
    var KIND = { person: 'Человек', veh: 'Транспорт', missing: 'Пропавший', unknown: 'Неизвестный', event: 'Оповещение' };
    function statusOf(x) { return S.closed[x.id] ? 'closed' : x.status; }
    // MDT: sightings sent from this window, the access chosen in the menu, an event log for «История изменений»
    function seenKey(s) { return s[0] + '|' + s[1] + '|' + s[3]; }
    function seenOf(r) { var del = (S.seenDel || {})[r.id] || []; return r.seen.concat((S.seenAdd || {})[r.id] || []).filter(function (s) { return del.indexOf(seenKey(s)) < 0; }); }
    function accOf(r) { var o = S.accOv || {}; return r.id in o ? o[r.id] : r.acc; }
    function nowStr() { var d = new Date(), p = function (v) { return String(v).padStart(2, '0'); }; return p(d.getDate()) + '.' + p(d.getMonth() + 1) + ', ' + p(d.getHours()) + ':' + p(d.getMinutes()); }
    function logAdd(id, what) { var L = Object.assign({}, self.state.log); L[id] = (L[id] || []).concat([[nowStr(), ME(), what]]); return L; }
    function chipsOf(x, full) {
      var st = statusOf(x);
      if (st === 'closed') return [chip(full ? 'Закрыта · ' + (x.closedHow || S.closed[x.id]) : 'Закрыта', 'green')].concat(full ? [chip(KIND[x.kind], 'grey')] : []);
      if (st === 'expired') return [chip('Срок истёк', 'grey')];
      var out = [chip(PRIO[x.prio][0] + (full ? ' приоритет' : ''), PRIO[x.prio][1])];
      if (x.armed) out.push(chip('Вооружён и опасен', 'red'));
      if (full || x.kind === 'missing') out.push(chip(KIND[x.kind], x.kind === 'missing' ? 'blue' : 'grey'));
      return out;
    }
    var CB = NEWC[S.nObj || 0][S.nBas || 0] || NEWC[0][0], NVI = VIDS.indexOf(CB.vid);
    // MDT: «Объявить в розыск» in Поиск — that person replaces the form's example person
    // MDT: the new form starts empty — the reference's example person / vehicle / texts are placeholders only (CBX)
    var CBX = CB;
    CB = Object.assign({}, CB, { rec: null, desc: '', place: '', instr: '', photos: [], links: [], radio: null, pc: {},
      extra: CB.extra.map(function (e) { return [e[0], '']; }),
      recSub: CB.rec ? (CB.kind === 'veh' ? 'Выберите машину из базы DMV или опишите её в приметах.' : 'Выберите человека из базы или опишите его в приметах.') : CB.recSub });
    // MDT: «Другой» on the «Из базы» card picks another MDC record (nRec) — handled like a person from Поиск
    var SJ = S.nSubject || S.nRec, sjSexAge = '';
    if (SJ && SJ.isVeh && CB.kind === 'veh') {
      CB = Object.assign({}, CB, { rec: [SJ.name + ' · ' + SJ.code, 'Из DMV: ' + SJ.sub], car: true, desc: SJ.sub + '.', place: '', links: ['Карточка DMV · ' + SJ.code, '+ Ордер', '+ Дело'], extra: [],
        radio: 'Всем экипажам: розыск ' + SJ.name + ', номер ' + SJ.code + '. ' + SJ.sub + '.' });
    } else if (SJ && !SJ.isVeh && (CB.kind === 'person' || CB.kind === 'missing')) {
      sjSexAge = SJ.sub.split(' · ').filter(function (t, i, a) { return i === 0 || i === a.length - 1; }).join(', ');
      CB = Object.assign({}, CB, { rec: [SJ.name + ' · ' + SJ.code, (S.nSubject ? 'Из Поиска: ' : 'Из базы MDC: ') + SJ.sub], desc: sjSexAge + '.' + (SJ.reason ? ' ' + SJ.reason : ''), place: '',
        photos: [['Из личного дела', 'subj']], links: ['Личное дело · ' + SJ.code, '+ Ордер', '+ Дело'], extra: [],
        instr: CB.vid === 'poi' || CB.kind === 'missing' ? CB.instr : 'Задержать и доставить в Mission Row. Сообщить автору.',
        radio: (CB.kind === 'missing' ? 'Всем экипажам: пропал(а) ' : 'Всем экипажам, ориентировка, %P приоритет: ') + SJ.name + ', ' + sjSexAge.toLowerCase() + '.' + (SJ.reason ? ' ' + SJ.reason + '.' : '') });
    }
    PHIMG.subj = SJ && SJ.photo ? SJ.photo : PHIMG.mug; PHI.subj = PHI.mug; PHB.subj = PHB.mug;
    // MDT: the chosen vehicle already has an open BOLO → the reference's duplicate warning, about that BOLO
    var DUPB = SJ && SJ.isVeh && CB.kind === 'veh' ? BOLOS.concat(S.made || []).filter(function (r) { return r.plate === SJ.code && statusOf(r) === 'open'; })[0] : null;
    var DB = DUPB || BOLOS.filter(function (r) { return r.id === 'b419'; })[0];
    var dupOn = DUPB ? !(S.dupSkip || {})[DUPB.id] : !!S.nDup;
    // MDT: «Убрать» on the «Из базы» card — the BOLO goes without a record (unknown person / unidentified vehicle)
    var recCan = !!CBX.rec && CB.kind !== 'event';
    if (S.nRecNone && recCan) {
      var vehNo = CB.kind === 'veh';
      CB = Object.assign({}, CB, { rec: null, car: false,
        recSub: vehNo ? 'Машина не выбрана: опишите её в приметах или выберите из базы DMV.' : 'Человек не выбран: опишите его в приметах или выберите из базы.',
        photos: CB.photos.filter(function (p) { return p[1] !== 'mug' && p[1] !== 'subj'; }),
        links: CB.links.filter(function (t) { return !/^(Личное дело|Карточка DMV)/.test(t); }),
        radio: 'Всем экипажам, ориентировка, %P приоритет: ' + (vehNo ? 'неизвестная машина. ' : 'неизвестный. ') + (S.nDesc != null ? S.nDesc : CB.desc) });
    }
    var ALL = BOLOS.concat(EVENTS);
    // MDT: BOLOs published from the form in this window (newest first)
    (S.made || []).forEach(function (m) { ALL.unshift(m); });
    var NAVDEF = [
      ['Ориентировки', [['active', 'Активные', ICN.list, function (x) { return statusOf(x) === 'open' && x.kind !== 'event'; }], ['high', 'Высокий приоритет', ICN.flame, function (x) { return statusOf(x) === 'open' && x.prio === 'high' && x.kind !== 'event'; }], ['people', 'Люди', ICN.person, function (x) { return statusOf(x) === 'open' && (x.kind === 'person' || x.kind === 'unknown'); }], ['veh', 'Транспорт', ICN.car, function (x) { return statusOf(x) === 'open' && x.kind === 'veh'; }], ['missing', 'Пропавшие', ICN.help, function (x) { return statusOf(x) === 'open' && x.kind === 'missing'; }], ['alerts', 'Оповещения', 'M3 8v4h3l6 4V4L6 8zM15 7.5a3.5 3.5 0 010 5', function (x) { return x.kind === 'event' && statusOf(x) === 'open'; }], ['map', 'Карта', ICN.map, null]]],
      ['Мои', [['mine', 'Созданные мной', ICN.me, function (x) { return isMe(x.author); }]]],
      ['Архив', [['closed', 'Закрытые', ICN.check, function (x) { return statusOf(x) === 'closed'; }], ['expired', 'Истёкшие', ICN.clock, function (x) { return statusOf(x) === 'expired'; }]]]
    ];
    var curNav = null;
    var navGroups = NAVDEF.map(function (g) {
      return { title: g[0], items: g[1].map(function (n) {
        var on = n[0] === 'map' ? S.view === 'map' : (S.view !== 'map' && S.view !== 'new' && S.view !== 'poster' && S.nav === n[0]);
        if (n[0] === S.nav) curNav = n;
        var cnt = n[3] ? ALL.filter(n[3]).length : '';
        var unread = n[3] ? ALL.filter(function (x) { return n[3](x) && x.unread && !S.acked[x.id]; }).length : 0;
        return { name: n[1], icon: n[2], count: cnt === '' ? '' : String(cnt), bg: on ? c.sel : 'transparent', op: on ? 1 : 0, fw: on ? 600 : 400, ic: n[0] === 'high' ? TN.red[1] : c.text2,
          cfw: unread ? 700 : 400, cc: unread ? c.text : c.text2,
          pick: function () { var cl = { dlg: null, pick: null, menu: false, menuAcc: false, menuVid: false, identPick: false }; if (n[0] === 'map') self.setState(Object.assign({ view: 'map' }, cl)); else self.setState(Object.assign({ view: 'feed', nav: n[0] }, cl)); } };
      }) };
    });
    curNav = curNav || NAVDEF[0][1][0];
    var qq = S.q.trim().toLowerCase();
    var base = ALL.filter(curNav[3]);
    var list = base.filter(function (x) { return S.src === 'all' || x.src === S.src; }).filter(function (x) { return !qq || (x.no + ' ' + x.no.replace('B-', '') + ' ' + x.title + ' ' + x.sub + ' ' + (x.plate || '') + ' ' + x.desc + ' ' + x.tags.join(' ')).toLowerCase().replace(/\s+/g, '').indexOf(qq.replace(/\s+/g, '')) >= 0; });
    var PO = { high: 0, mid: 1, low: 2 };
    list.sort(function (a, b) { return PO[a.prio] - PO[b.prio]; });
    var x = list.filter(function (y) { return y.id === S.sel; })[0] || EVENTS.filter(function (y) { return y.id === S.sel; })[0] || list[0] || ALL[0];
    var rows = list.map(function (y) {
      var on = y.id === x.id, unread = y.unread && !S.acked[y.id], st = statusOf(y);
      return { src: SRC[y.src][0], srcFg: c.text2, title: y.title, sub: y.no + ' · ' + y.sub, ago: y.ago, chips: chipsOf(y, false).concat(st === 'open' && y.expSoon && !S.ext[y.id] ? [chip('Истекает ' + y.expSoon[1], 'grey')] : []).concat(st === 'open' && ((y.updNew && !S.seenUpd[y.id]) || S.updated[y.id]) ? [chip('Обновлена', 'grey')] : []).map(function (ch) { if (ch.t === 'Вооружён и опасен' || ch.t === 'Пропавший') return ch; if (ch.t === 'Высокий') return { t: ch.t, bg: TN.grey[0], fg: TN.red[1] }; return { t: ch.t, bg: TN.grey[0], fg: c.text2 }; }).filter(function (ch) { return ch.t !== 'Низкий'; }).slice(0, 3), unread: unread, fw: unread ? 700 : 600, bg: on ? c.sel : 'transparent',
        bar: st !== 'open' ? 'transparent' : y.prio === 'high' ? TN.red[1] : y.prio === 'mid' ? TN.amber[1] : 'transparent',
        img: y.mainImg || '', carImg: y.kind === 'veh' ? vehiclePhoto(y.title, y.carColor || y.sub) : '', isVeh: y.kind === 'veh', isPerson: y.kind === 'person' || y.kind === 'missing', unknown: y.kind === 'unknown', isEvent: y.kind === 'event', evIcon: y.bulletin ? 'M10 2l7 3v5c0 4-3 7-7 8-4-1-7-4-7-8V5zM10 7v4M10 13.5h.01' : 'M3 9.5L10 4l7 5.5M5 8v5M15 8v5M2 15c1.3 0 1.3 1 2.7 1s1.3-1 2.6-1 1.3 1 2.7 1 1.3-1 2.6-1 1.3 1 2.7 1 1.4-1 2.7-1', carColor: y.carColor || '#888', thumbBg: y.kind === 'veh' ? c.photoSky : c.mug,
        pick: function () { self.setState({ sel: y.id }); } };
    });

    // detail
    var st = statusOf(x);
    var es = S.extraSeen[x.id];
    var seen = seenOf(x);
    var nSeen = seen.length;
    var TR = x.prio === 'high' ? TN.red[1] : TN.amber[1];
    function go() { /* cross-link to Поиск, Дела, Ордера */ }
    // MDT: the person / vehicle title and record links open the module that owns the record
    function goRec(kind, label) { if (self.props.onLink) self.props.onLink(kind, label); }
    var reacked = !!(S.reack || {})[x.id], ack = (reacked ? 0 : x.ack[0]) + (S.acked[x.id] ? 1 : 0);
    var b = {
      src: SRC[x.src][0], srcName: SRC[x.src][1], srcBg: TN[SRC[x.src][2]][0], srcFg: TN[SRC[x.src][2]][1],
      id: x.no, chips: chipsOf(x, true), open: st === 'open', closeLabel: x.kind === 'event' ? 'Снять оповещение' : x.kind === 'missing' ? 'Найден' : x.kind === 'veh' ? 'Найдена' : 'Задержан',
      closed: st !== 'open', closedIcon: st === 'expired' ? 'M10 3a7 7 0 100 14 7 7 0 100-14zM10 6.5V10l2.5 2' : 'M4 10.5l3.5 3.5L16 5.5', closedBg: st === 'closed' ? TN.green[0] : TN.grey[0], closedFg: st === 'closed' ? TN.green[1] : c.text2,
      closedTitle: st === 'closed' ? 'Закрыта: ' + (x.closedHow || S.closed[x.id]).toLowerCase() : 'Срок действия истёк 12.11',
      closedText: st === 'closed' ? (x.closedBy ? x.closedBy + ' · ' + x.closedAt + ' · арест A-2026-1187' : ME() + ' · только что' + ((S.closedArr || {})[x.id] ? ' · арест ' + S.closedArr[x.id].split(' · ')[0] : '') + ((S.closedNote || {})[x.id] ? ' · причина: ' + S.closedNote[x.id] : '') + ' · все на смене получили уведомление') : 'Никто не продлил. Можно создать заново из этой карточки.',
      mainImg: x.mainImg || '', carImg: x.kind === 'veh' ? vehiclePhoto(x.title, x.carColor || x.sub) : '', isVeh: x.kind === 'veh', isPerson: x.kind === 'person' || x.kind === 'missing', unknown: x.kind === 'unknown', isEvent: x.kind === 'event', isEv: x.kind === 'event', notEv: x.kind !== 'event', evIcon: x.bulletin ? 'M10 2l7 3v5c0 4-3 7-7 8-4-1-7-4-7-8V5zM10 7v4M10 13.5h.01' : 'M3 9.5L10 4l7 5.5M5 8v5M15 8v5M2 15c1.3 0 1.3 1 2.7 1s1.3-1 2.6-1 1.3 1 2.7 1 1.3-1 2.6-1 1.3 1 2.7 1 1.4-1 2.7-1', showInstr: st === 'open' && !!x.instr, evTitle: x.bulletin ? 'Что происходит' : 'Что делать жителям', evParas: ((PX[x.id] || {}).paras || [(PX[x.id] || {}).narr || '']).map(function (t) { return { t: t }; }), evHasRecs: !!x.bulletin, evRecTitle: (PX[x.id] || {}).listTitle || 'Что советуем жителям', evRecs: ((PX[x.id] || {}).recs || BULRECS).map(function (t, i, a) { return { n: (i < 9 ? '0' : '') + (i + 1), t: t, sep: i === a.length - 1 ? 'transparent' : c.stroke }; }), carColor: x.carColor || '#888',
      photoW: x.kind === 'veh' ? '248px' : '136px', photoBg: x.kind === 'veh' ? 'linear-gradient(180deg, ' + c.photoSky + ' 0%, ' + c.photoSky + ' 62%, ' + c.photoGround + ' 62%, ' + c.photoGround + ' 100%)' : c.mug,
      photoLines: x.kind === 'veh' ? 'none' : 'repeating-linear-gradient(to bottom, transparent 0, transparent 19px, ' + c.mugLine + ' 19px, ' + c.mugLine + ' 20px)',
      photoCap: x.kind === 'veh' ? 'Фото из реестра DMV' : x.kind === 'unknown' ? 'Фото нет' : x.kind === 'missing' ? 'От родственников' : 'Из личного дела',
      reason: VID[x.vid][0].toUpperCase() + ' · ' + x.reason, reasonColor: st === 'open' ? TN[VID[x.vid][1]][1] : c.text2, hasPlate: !!x.plate, plate: x.plate || '',
      title: x.title, subtitle: x.plate ? x.sub.replace(x.plate + ' · ', '') : x.sub, titleLink: x.kind === 'person' || x.kind === 'veh', titlePlain: !(x.kind === 'person' || x.kind === 'veh'), titleGo: function () { goRec(x.kind === 'veh' ? 'car' : 'person', x.plate || x.title); },
      facts: [['Номер', x.no], ['Подал', SRC[x.src][0] + ' · ' + SRC[x.src][1]]].concat(x.kind === 'event' && (PX[x.id] || {}).facts ? PX[x.id].facts.concat(x.facts) : x.facts).map(function (f, fi, fa) { if (/Действует до/.test(f[0]) && S.ext[x.id]) f = [f[0], S.ext[x.id]]; return { sep: fi === fa.length - 1 ? 'transparent' : c.stroke, k: f[0], v: f[1], isLink: !!f[2], plain: !f[2], go: function () { if (/^b4/.test(f[2] || '')) self.setState({ sel: f[2], nav: 'active' }); else goRec(f[2], f[1]); } }; }),
      hasLinks: x.links.length > 0, instrTitle: st === 'open' ? (x.kind === 'event' ? 'Для экипажей' : 'При обнаружении') : 'Действий не требуется', instr: st === 'open' ? x.instr : (st === 'closed' ? 'Ориентировка закрыта. Отметки «Замечен» больше не принимаются.' : 'Срок истёк, никто не продлил. Можно создать новую из этой карточки.'), instrBg: st !== 'open' ? c.card : x.armed ? TN.red[0] : TN.amber[0], instrFg: st !== 'open' ? c.text2 : x.armed ? TN.red[1] : TN.amber[1],
      pcs: x.pc.map(function (n) { return { n: 'PC ' + n, t: PCN[n] || '' }; }), hasPc: x.pc.length > 0, noPc: !x.pc.length, noPcText: x.vid === 'missing' ? 'Не применяется: пропавший без вести' : 'Статья не указана: человек не обвиняется',
      ctName: x.ct[0], ctRole: x.ct[1], ctPhone: x.ct[2],
      desc: x.desc, tags: x.tags.map(function (t) { return { t: t }; }),
      photos: x.photos.concat((Array.isArray(S.addedPhoto[x.id]) ? S.addedPhoto[x.id] : []).map(function (u0, i) { var u = photoUrl(u0), k = 'up' + x.id + '_' + i; if (u) { PHIMG[k] = u; PHI[k] = PHI.cam; PHB[k] = PHB.cam; } return [photoCap(u0, 'Добавлено вами · только что'), u ? k : 'cam']; })).map(function (p) { var im = p[1] === 'mug' && x.mainImg ? x.mainImg : PHIMG[p[1]]; return { cap: p[0], icon: PHI[p[1]], hasImg: !!im, noImg: !im, img: im || '', bg: 'linear-gradient(160deg, ' + PHB[p[1]][0] + ', ' + PHB[p[1]][1] + ')' }; }),
      links: x.links.map(function (l, li, la) { return { sep: li === la.length - 1 ? 'transparent' : c.stroke, k: l[0], v: l[1], icon: ICN[l[2]] || ICN.doc, go: function () { if (l[2] === 'bolo') { var m = l[1].match(/B-0(\d{3})/); if (m) self.setState({ nav: 'active', sel: 'b' + m[1] }); } else goRec(l[2], l[1]); } }; }),
      seenCount: nSeen ? nSeen + ' ' + plRu(nSeen, 'отметка', 'отметки', 'отметок') + ' · последняя ' + seen[nSeen - 1][1] : 'Пока никто не отмечал',
      seen: seen.slice().reverse().map(function (s, i, a) { var n = nSeen - i; return { n: String(n), key: seenKey(s), place: s[0], when: s[1], text: s[2], who: s[3], go: function () { if (/\s/.test(s[3]) && !/^Вы /.test(s[3])) goRec('person', s[3].replace(/\s*\(.*\)$/, '')); }, dot: i === 0 && st === 'open' ? TR : c.stroke2, line: i === a.length - 1 ? 'transparent' : c.stroke }; }),
      pins: seen.map(function (s, i) { var last = i === nSeen - 1; return { x: s[4] + '%', y: s[5] + '%', n: String(i + 1), s: last ? '20px' : '16px', bg: last && st === 'open' ? TR : '#9AA0A6', halo: last && st === 'open' ? '4px' : '0', haloC: last ? TN[x.prio === 'high' ? 'red' : 'amber'][0] : 'transparent' }; }),
      trail: seen.map(function (s) { return s[4] + ',' + s[5]; }).join(' '), trailColor: TR,
      ackText: ack + ' из ' + x.ack[1] + ' на смене', ackPct: Math.round(ack / x.ack[1] * 100) + '%',
      meta: 'Создал ' + x.author + ' (' + SRC[x.src][0] + ') · ' + x.created + ' · ' + x.no + ' · доступ: ' + (accOf(x) || 'все агентства'),
      showUpd: st === 'open' && !!x.updNew && !S.seenUpd[x.id], updTitle: x.updNew ? 'Обновлена ' + x.updNew[0] : '', updText: x.updNew ? x.updNew[1] : '',
      updOk: function () { var o = Object.assign({}, self.state.seenUpd); o[x.id] = true; self.setState({ seenUpd: o }); },
      showExp: st === 'open' && !!x.expSoon && !S.ext[x.id], expTitle: x.expSoon ? 'Истекает ' + x.expSoon[0] + ', ' + x.expSoon[1] : '',
      expBtns: [['+24 ч', '18.11, 20:00'], ['+3 дня', '20.11, 20:00'], ['+7 дней', '24.11, 20:00']].map(function (e) { return { t: e[0], go: function () { var o = Object.assign({}, self.state.ext); o[x.id] = e[1]; self.setState({ ext: o, log: logAdd(x.id, 'Продлена до ' + e[1]) }); toast('ext'); } }; }),
      showArrest: st === 'open' && S.arrest && x.id === 'b412',
      arrestNo: function () { self.setState({ arrest: false }); }, arrestClose: function () { self.setState({ dlg: 'close', closeWhy: 0 }); },
      hist: (x.hist || [[x.created, x.author.split(' ').slice(-2).join(' '), 'Создана']]).concat((S.log || {})[x.id] || []).slice().reverse().map(function (h, i, a) { return { when: h[0], who: h[1], what: h[2], dot: i === 0 ? accent : c.stroke2, line: i === a.length - 1 ? 'transparent' : c.stroke }; }),
      needAck: st === 'open' && !S.acked[x.id] && (x.unread || reacked), acked: st === 'open' && (!!S.acked[x.id] || !(x.unread || reacked)), ackedText: S.acked[x.id] ? 'Вы ознакомились · только что' : 'Вы ознакомились · ' + x.created
    };

    // map
    var MF = [['all', 'Все активные'], ['high', 'Высокий приоритет'], ['24', 'За 24 часа']];
    function seenTs(s) { var m = /^(\d{2})\.(\d{2}), (\d{2}):(\d{2})/.exec(s[1] || ''); return m ? new Date(2026, +m[2] - 1, +m[1], +m[3], +m[4]).getTime() : 0; }
    function lastTs(y) { var l = seenOf(y); return l.length ? seenTs(l[l.length - 1]) : 0; }
    var TS_ANCHOR = ALL.reduce(function (mx, y) { return y.kind === 'event' ? mx : Math.max(mx, lastTs(y)); }, 0);
    var active = ALL.filter(function (y) { return y.kind !== 'event' && seenOf(y).length > 0 && statusOf(y) === 'open' && (S.mapF !== 'high' || y.prio === 'high') && (S.mapF !== '24' || lastTs(y) >= TS_ANCHOR - 864e5); });
    var selMap = active.filter(function (y) { return y.id === S.sel; })[0] || active[0];
    var mapPins = active.map(function (y) {
      var s = seenOf(y)[seenOf(y).length - 1], on = y.id === selMap.id, col = y.kind === 'missing' ? TN.blue[1] : y.prio === 'high' ? TN.red[1] : TN.amber[1];
      return { x: s[4] + '%', y: s[5] + '%', title: y.title, label: (y.plate || y.title) + ' · ' + s[1].split(', ')[1], labelBg: on ? c.btn : 'rgba(0,0,0,0.55)', s: on ? '22px' : '16px', bg: col, ring: on ? '#FFFFFF' : 'rgba(0,0,0,0.35)', pick: function () { self.setState({ sel: y.id }); } };
    });
    var mapTrails = active.filter(function (y) { return seenOf(y).length > 1; }).map(function (y) { return { pts: seenOf(y).map(function (s) { return s[4] + ',' + s[5]; }).join(' '), color: y.prio === 'high' ? TN.red[1] : TN.amber[1] }; });
    var mapList = active.map(function (y) { var s = seenOf(y)[seenOf(y).length - 1], on = y.id === selMap.id; return { title: y.title, id: SRC[y.src][0] + ' · ' + y.no, last: s[0] + ' · ' + s[1], dot: y.kind === 'missing' ? TN.blue[1] : y.prio === 'high' ? TN.red[1] : TN.amber[1], bg: on ? c.sel : c.card, ring: on ? 'inset 0 0 0 1px ' + c.stroke2 : 'none', pick: function () { self.setState({ sel: y.id }); } }; });

    var autoTpl = x.bulletin ? 'bulletin' : x.vid === 'missing' ? 'missing' : x.vid === 'alert' ? 'alert' : x.vid === 'special' ? 'special' : x.vid === 'poi' ? (x.kind === 'unknown' ? 'identify' : 'poi') : x.kind === 'veh' ? (/угон/i.test(x.reason) ? 'stolen' : 'wanted') : 'wanted';
    // new
    function seg(arr, cur, key, extra) { return arr.map(function (t, i) { var on = cur === i; return Object.assign({ t: t, bg: on ? c.btn : 'transparent', fg: on ? c.text : c.text2, fw: on ? 600 : 400, pick: function () { var o = {}; o[key] = i; self.setState(o); } }, extra ? extra(i, on) : {}); }); }
    function pills(arr, cur, key, multi) { return arr.map(function (t, i) { var on = multi ? !!cur[i] : cur === i; return { t: t, bg: on ? (dark ? '#FFFFFF' : '#1B1B1B') : c.btn, fg: on ? (dark ? '#1B1B1B' : '#FFFFFF') : c.text, fw: on ? 600 : 400, pick: function () { var o = {}; if (multi) { var m = Object.assign({}, self.state[key]); m[i] = !m[i]; o[key] = m; } else o[key] = i; self.setState(o); } }; }); }
    var nTypes = [['Человек', ICN.person], ['Транспорт', ICN.car], ['Пропавший', ICN.help], ['Другое', ICN.doc]].map(function (t, i) { var on = S.nType === i; return { t: t[0], icon: t[1], bg: on ? c.sel : c.card, ring: on ? 'inset 0 0 0 2px ' + accent : 'none', fw: on ? 600 : 400, pick: function () { self.setState({ nType: i }); } }; });
    var nPrio = ['Низкий', 'Средний', 'Высокий'].map(function (t, i) { var on = S.nPrio === i, tone = ['grey', 'amber', 'red'][i]; return { t: t, bg: on ? TN[tone][0] : 'transparent', fg: on ? TN[tone][1] : c.text2, fw: on ? 600 : 400, pick: function () { self.setState({ nPrio: i, nLv: i }); } }; });
    var TERMS = ['24 часа', '3 дня', '7 дней', 'До отмены'], ZONES = ['Весь округ', 'Los Santos', 'Sandy Shores', 'Paleto Bay', 'Vespucci и Del Perro'];
    var REASONS = ['Ордер на арест', 'Подозреваемый', 'Свидетель', 'Угон', 'Пропал без вести'];
    var VIDHINT = ['Обычный розыск: подозреваемый, ордер, угнанная машина.', 'Опасный или приоритетный: метка в рации, всплывает у всех на смене со звуком.', 'Не обвиняется, но нужен для разговора: свидетель, возможный участник.', 'Человек пропал, ищем, чтобы помочь. Статья не нужна.', 'Происшествие для жителей: наводнение, пожар, утечка газа, перекрытия. Без розыска и статьи.'];
    var pcSel = Object.keys(S.nPc).filter(function (k) { return S.nPc[k]; });
    var pcQ = (S.nPcQ || '').toLowerCase();
    var pcSug = Object.keys(PCN).filter(function (k) { return !S.nPc[k] && (!pcQ || k.indexOf(pcQ) === 0 || PCN[k].toLowerCase().indexOf(pcQ) >= 0); }).slice(0, 3);
    var zonesOn = ZONES.filter(function (z, i) { return S.nZone[i]; });
    var prioT = ['Низкий', 'Средний', 'Высокий'][S.nPrio];
    // MDT: typed form fields (event title, texts, contacts…) and the event's points list
    function formErrors() {
      var E = {}, dsc = String(S.nDesc != null ? S.nDesc : CB.desc).trim(), plc = String(S.nPlaceTxt || '').trim();
      if (CB.kind === 'event') {
        if (CB.bulletin) { if (!fv('bSub').trim()) E.bSub = 'Укажите подзаголовок: он станет названием ориентировки'; if (!fv('bText').trim()) E.bText = 'Напишите текст бюллетеня'; }
        else { if (!fv('alTitle').trim()) E.alTitle = 'Укажите заголовок'; if (!fv('alTodo').trim()) E.alTodo = 'Напишите, что делать жителям'; }
        return E;
      }
      if (!CB.rec && !dsc) E.desc = CB.kind === 'veh' ? 'Выберите машину из базы или опишите её' : 'Выберите человека из базы или опишите приметы';
      if ((CB.vid === 'wanted' || CB.vid === 'special') && !CB.pcOffText && !pcSel.length) E.pc = 'Укажите статью: за что разыскивается';
      if (!S.nPlace && !plc) E.place = 'Укажите, где видели последний раз, или поставьте точку на карте';
      return E;
    }
    var NE = S.nTried ? formErrors() : {};
    // MDT: radio text of the open card (⋯ → «Скопировать текст для рации»)
    function copyRadio() { var t = 'Всем экипажам, ориентировка ' + x.no + ', ' + PRIO[x.prio][0].toLowerCase() + ' приоритет: ' + x.title + (x.plate ? ', номер ' + x.plate : '') + '. ' + (x.desc || '') + (x.armed ? ' Вооружён и опасен.' : '') + (x.instr ? ' ' + x.instr : ''); if (navigator.clipboard) navigator.clipboard.writeText(t).catch(function () {}); self.setState({ menu: false }); toast('radio'); }
    // MDT: a closed / expired BOLO → the new form filled from it
    function recreate() {
      var ob = x.kind === 'event' ? 3 : x.kind === 'veh' ? 2 : x.kind === 'unknown' ? 1 : 0;
      var bas = ob === 0 ? Math.max(0, ['wanted', 'special', 'poi', 'missing'].indexOf(x.vid)) : ob === 1 ? (x.vid === 'poi' ? 1 : 0) : ob === 3 ? (x.bulletin ? 1 : 0) : 0;
      var code = String(x.sub || '').split(' · ')[0];
      var rec = (x.kind === 'person' || x.kind === 'missing') ? { recId: '', name: x.title, code: /^CIT-/.test(code) ? code : '', sub: x.sub, vid: 0, reason: '', armed: !!x.armed, isVeh: false, photo: x.mainImg || null }
        : x.kind === 'veh' && x.plate ? { recId: '', name: x.title, code: x.plate, sub: String(x.sub || '').replace(x.plate + ' · ', ''), vid: 0, reason: '', armed: false, isVeh: true, photo: null } : null;
      var pc = {}; x.pc.forEach(function (k) { pc[k] = true; });
      self.setState({ view: 'new', menu: false, dlg: null, nObj: ob, nBas: bas, nRec: rec, nSubject: null, nRecNone: false, nPc: pc, nDesc: x.desc || null, nInstr: x.instr || null, nPrio: Math.max(0, ['low', 'mid', 'high'].indexOf(x.prio)), armed: !!x.armed,
        nLinks: x.links.map(function (l) { return l[0] + ' ' + l[1]; }), nTried: false, nEx: {}, nPlaceTxt: null, nPlace: null,
        f: x.kind === 'event' ? (x.bulletin ? { bSub: x.title } : { alTitle: x.title, alDesc: x.desc, alTodo: x.instr }) : {} });
    }
    function linkList() { return S.nLinks || CB.links.filter(function (t) { return t.charAt(0) !== '+'; }); }
    function fv(k) { var fs = S.f || {}; return fs[k] != null ? fs[k] : FDEF[k]; }
    function edAl(a, i, j) { return function (e) { var n = a.map(function (r) { return r.slice(); }); n[i][j] = e.target.value; self.setState({ alF: n }); }; }
    // MDT: «Опубликовать» — the BOLO as the form shows it
    function makeNew() {
      var made = S.made || [], n = 421 + made.length, id = 'b' + n, isEv = CB.kind === 'event', isVeh = CB.kind === 'veh';
      var p2 = function (v) { return String(v).padStart(2, '0'); }, now = new Date();
      var day = function (d) { return p2(d.getDate()) + '.' + p2(d.getMonth() + 1); };
      var when = day(now) + ', ' + p2(now.getHours()) + ':' + p2(now.getMinutes());
      var till = S.nTerm === 3 ? 'До отмены' : (function () { var d = new Date(now.getTime() + [1, 3, 7][S.nTerm] * 864e5); return S.nTerm === 0 ? day(d) + ', ' + p2(d.getHours()) + ':' + p2(d.getMinutes()) : day(d); })();
      var recName = CB.rec ? CB.rec[0].split(' · ') : [];
      var title = CB.bulletin ? fv('bSub') : isEv ? fv('alTitle') : recName[0] || (isVeh ? 'Неизвестная машина' : 'Неизвестный');
      var code = recName[1] || '', plate = isVeh ? code : '';
      var desc = CB.bulletin ? fv('bText') : isEv ? fv('alDesc') : S.nDesc != null ? S.nDesc : CB.desc;
      var instr = isEv ? (CB.bulletin ? '' : fv('alTodo')) : S.nInstr != null ? S.nInstr : CB.instr;
      var alF = (S.alF || AL0).filter(function (r) { return r[0].trim() && r[1].trim(); });
      var photos = CB.photos.concat((S.nUp || []).map(function (u0, i) { var u = photoUrl(u0), k = 's' + n + 'u' + i; if (u) { PHIMG[k] = u; PHI[k] = PHI.cam; PHB[k] = PHB.cam; } return [photoCap(u0, 'Добавлено вами'), u ? k : 'cam']; }));
      if (SJ && SJ.photo) { PHIMG['s' + n] = SJ.photo; PHI['s' + n] = PHI.mug; PHB['s' + n] = PHB.mug; photos = photos.map(function (p) { return p[1] === 'subj' ? [p[0], 's' + n] : p; }); }
      var LK = [[/^Ориентировка/, 'Ориентировка', 'bolo'], [/^Ордер/, 'Ордер', 'doc'], [/^Дело/, 'Дело', 'case'], [/^Личное дело/, 'Личное дело', 'person'], [/^Вызов/, 'Вызов', 'call'], [/^(Заявление|Рапорт)/, 'Заявление', 'doc']];
      var links = linkList().map(function (t) {
        var k = LK.filter(function (r) { return r[0].test(t); })[0];
        if (k && k[2] === 'person') return [k[1], title + (code ? ' · ' + code : ''), 'person'];
        return k ? [k[1], t.replace(k[0], '').replace(/^\s*·?\s*/, ''), k[2]] : ['Связано', t, 'doc'];
      });
      var facts = (isEv && !CB.bulletin ? alF : []).concat(isVeh ? [['Номер', plate]] : []).concat(sjSexAge ? [['Пол, возраст', sjSexAge]] : []).concat(CB.extra.map(function (e) { return [e[0], (S.nEx || {})[e[0]] || e[1]]; }).filter(function (e) { return String(e[1]).trim(); }))
        .concat([['Зона', zonesOn.join(', ') || 'Весь округ'], ['Действует до', till]]);
      var plcT = String(S.nPlaceTxt || '').trim();
      if (!S.nPlace && plcT && !isEv) facts.splice(facts.length - 2, 0, ['Последний раз видели', plcT]);
      var seen = S.nPlace ? [[plcT || nearest(S.nPlace.x, S.nPlace.y), when, 'Последний раз видели — указано при создании.', ME(), S.nPlace.x, S.nPlace.y]] : [];
      var reason = isEv ? (CB.bulletin ? fv('bTitle') || 'Бюллетень безопасности' : 'Оповещение населения') : (SJ && SJ.reason) || (pcSel.length ? PCN[pcSel[0]] : (String(desc).split(/[.!?\n]/)[0].trim().slice(0, 60) || CB.t));
      // the card and the poster of an event read their texts from PX
      if (isEv) PX[id] = CB.bulletin
        ? { unit: 'Mission Row Station', caseNo: '', wantedFor: fv('bSub'), paras: desc.split(/\n\s*\n/).filter(Boolean), listTitle: fv('bListT'), recs: (S.bR || BULRECS).filter(function (t) { return t.trim(); }), contact: fv('bCt'), approved: 'Утвердил: ' + fv('bAppr') }
        : { unit: 'Mission Row Station', caseNo: '', wantedFor: desc, narr: instr, contact: fv('alCall') };
      var ct = !isEv ? CTS[S.nCt].slice(0, 3) : CB.bulletin ? [fv('bCt').split(' · ')[0], 'Бюллетень безопасности', fv('bCt').split(' · ')[1] || '—'] : ['Штаб по ЧС', 'Los Santos · Emergency', '311'];
      return { id: id, acc: S.nAcc ? ACCS[S.nAcc][0].charAt(0).toLowerCase() + ACCS[S.nAcc][0].slice(1) : null, vid: VIDS[NVI], pc: pcSel.slice(), ct: ct, photos: photos, src: activeBoloSrc(), no: 'B-0' + n,
        kind: CB.kind === 'person' && !CB.rec ? 'unknown' : CB.kind, bulletin: !!CB.bulletin, prio: ['low', 'mid', 'high'][S.nPrio], armed: !isEv && S.armed, status: 'open', title: title, plate: plate || undefined, carColor: isVeh ? '#2A2A2A' : undefined,
        sub: isEv ? (zonesOn.join(', ') || 'Весь округ') : (code ? code + ' · ' : '') + CB.t.toLowerCase(), reason: String(reason).toUpperCase(), reasonTone: VID[VIDS[NVI]][1],
        mainImg: SJ && SJ.photo ? SJ.photo : '', facts: facts, desc: desc, tags: [], instr: instr, links: links, seen: seen,
        ack: [0, 52], author: ME(), created: when, ago: 'сейчас', unread: false, hist: [[when, ME(), 'Создана · ' + CB.t]] };
    }

    return {
      c: c, T: { green: TN.green[1], red: TN.red[1] }, greenBg: TN.green[0], amberBg: TN.amber[0], amberFg: TN.amber[1], blueBg: TN.blue[0], blueFg: TN.blue[1], accent: accent, onAccent: onAccent,
      notifOpen: !!S.notifOpen, notifToggle: function () { self.setState({ notifOpen: !self.state.notifOpen }); }, notifCur: ['Все', 'Высокий', 'Выкл'][S.notif] || '', notifChevron: S.notifOpen ? 'M5 12.5l5-5 5 5' : 'M5 7.5l5 5 5-5',
      notifOpts: ['Все', 'Высокий', 'Выкл'].map(function (t, i) { var on = S.notif === i; return { t: t, bg: on ? c.btn : 'transparent', fg: on ? c.text : c.text2, fw: on ? 600 : 400, pick: function () { self.setState({ notif: i }); } }; }),
      notifText: ['Всплывающее окно на любую новую ориентировку, высокий приоритет — ещё и со звуком.', 'Всплывающее окно только на высокий приоритет. Остальные — точкой в списке.', 'Только точка в списке. Высокий приоритет всё равно придёт в Почту.'][S.notif],
      incoming: !!S.incoming && S.notif !== 2 && S.view === 'feed', redBg: TN.red[0], redFg: TN.red[1],
      dismissIncoming: function () { self.setState({ incoming: false }); },
      ackIncoming: function () { var o = Object.assign({}, self.state.acked); o.b420 = true; self.setState({ incoming: false, acked: o }); },
      openIncoming: function () { self.setState({ incoming: false, view: 'feed', nav: 'active', sel: 'b420' }); },
      srcFilters: [['all', 'Все', 'Все ведомства']].concat(Object.keys(SRC).map(function (k) { return [k, SRC[k][0], SRC[k][1]]; })).map(function (f) {
        var on = S.src === f[0], n = base.filter(function (y) { return f[0] === 'all' || y.src === f[0]; }).length;
        return { t: f[1], title: f[2], n: String(n), bg: on ? (dark ? '#FFFFFF' : '#1B1B1B') : c.card, fg: on ? (dark ? '#1B1B1B' : '#FFFFFF') : c.text, fw: on ? 600 : 400, pick: function () { self.setState({ src: f[0] }); } }; }),
      lspdBg: TN.blue[0], lspdFg: TN.blue[1],
      pick: !!S.pick, pk: (function () {
        var p = S.pin, mode = S.pick, tgt = mode === 'map' ? (ALL.filter(function (y) { return y.id === S.sel && statusOf(y) === 'open'; })[0] || ALL.filter(function (y) { return statusOf(y) === 'open'; })[0]) : (mode === 'seen' ? x : null);
        var old = tgt ? seenOf(tgt) : []; var RR = S.accR != null ? S.accR : ACC_R[S.acc || 0];
        return { title: mode === 'new' ? 'Где видели последний раз' : 'Замечен: ' + (tgt ? tgt.title : ''),
          sub: mode === 'new' ? 'Новая ориентировка · точка станет первой отметкой на карте' : (tgt ? tgt.no + ' · серые точки — прошлые отметки' : ''),
          hasPin: !!p, noPin: !p, x: p ? p.x + '%' : '0', y: p ? p.y + '%' : '0', r: RR > 0 ? (RR * 2) + '%' : '0', hasR: RR > 0, accR: RR, accLabel: RR > 0 ? accTxt(RR).replace(' · ', '') : 'точная точка', accSet: function (v) { var n = +v, i = ACC_R.findIndex(function (q) { return Math.abs(q - n) < 0.05; }); self.setState({ accR: n, acc: i }); }, halo: dark ? 'rgba(96,205,255,0.14)' : 'rgba(0,95,184,0.12)',
          place: p ? 'Рядом: ' + nearest(p.x, p.y) + accTxt(RR) : 'Точка не выбрана', placeColor: p ? c.text : c.text2,
          old: old.map(function (s) { return { x: s[4] + '%', y: s[5] + '%' }; }), trail: old.map(function (s) { return s[4] + ',' + s[5]; }).join(' '),
          acc: ['Точно', '~200 м', 'Район'].map(function (t, i) { var on = S.acc === i; return { t: t, bg: on ? c.btn : 'transparent', fg: on ? c.text : c.text2, fw: on ? 600 : 400, pick: function () { self.setState({ acc: i, accR: null }); } }; }),
          okLabel: mode === 'map' ? 'Далее' : 'Готово', okBg: p ? accent : c.btn, okFg: p ? onAccent : c.text2 };
      })(),
      pickClick: function (e) { var r = e.currentTarget.getBoundingClientRect(); var px = Math.max(3, Math.min(97, (e.clientX - r.left) / r.width * 100)); var py = Math.max(3, Math.min(97, (e.clientY - r.top) / r.height * 100)); self.setState({ pin: { x: +px.toFixed(1), y: +py.toFixed(1) } }); },
      // MDT: a click on the real map arrives as % of the map image
      __pickAt: function (px, py) { self.setState({ pin: { x: +px.toFixed(1), y: +py.toFixed(1) } }); },
      __seenPt: S.seenPin || GPS,
      pickGps: function (e) { if (e && e.stopPropagation) e.stopPropagation(); self.setState({ pin: { x: GPS.x, y: GPS.y }, acc: 0, accR: null }); },
      pickCancel: function () { self.setState({ pick: null, pin: null }); },
      pickDone: function () {
        var p = self.state.pin; if (!p) return;
        if (self.state.pick === 'new') self.setState({ pick: null, nPlace: { x: p.x, y: p.y, acc: self.state.acc, r: (self.state.accR != null ? self.state.accR : ACC_R[self.state.acc || 0]) }, nPlaceTxt: null });
        else if (self.state.pick === 'seen') self.setState({ pick: null, seenPin: Object.assign({ r: (self.state.accR != null ? self.state.accR : ACC_R[self.state.acc || 0]) }, p), dlg: 'seen', sf: Object.assign({}, self.state.sf, { place: null }) });
        else { var t = ALL.filter(function (y) { return y.id === self.state.sel && statusOf(y) === 'open'; })[0] || ALL.filter(function (y) { return statusOf(y) === 'open'; })[0]; self.setState({ pick: null, seenPin: Object.assign({ r: (self.state.accR != null ? self.state.accR : ACC_R[self.state.acc || 0]) }, p), sel: t.id, view: 'feed', nav: 'active', dlg: 'seen', sf: {} }); }
      },
      pickForNew: function () { self.setState({ pick: 'new', pin: self.state.nPlace ? { x: self.state.nPlace.x, y: self.state.nPlace.y } : null }); },
      pickForSeen: function () { self.setState({ pick: 'seen', dlg: null, pin: self.state.seenPin || { x: GPS.x, y: GPS.y } }); },
      pickForMap: function () { self.setState({ pick: 'map', pin: null }); },
      nPlaceText: S.nPlace ? nearest(S.nPlace.x, S.nPlace.y) + accTxt(S.nPlace.r != null ? S.nPlace.r : ACC_R[S.nPlace.acc || 0]) + '' : CB.place,
      nPickLabel: S.nPlace ? 'Точка стоит' : 'На карте', nPickBg: S.nPlace ? TN.green[0] : c.btn, nPickFg: S.nPlace ? TN.green[1] : c.text,
      seenPlaceText: S.seenPin ? nearest(S.seenPin.x, S.seenPin.y) + accTxt(S.seenPin.r) : 'Grove St / Forum Dr, Davis', seenSrcTag: S.seenPin ? 'указано на карте' : 'ваше место · GPS',
      addPhoto: function (url, cap) { var o = Object.assign({}, self.state.addedPhoto); o[x.id] = (Array.isArray(o[x.id]) ? o[x.id] : []).concat([typeof url === 'string' ? (cap ? { url: url, cap: cap } : url) : '']); self.setState({ addedPhoto: o, log: logAdd(x.id, 'Добавлено фото' + (cap ? ': ' + cap : '')) }); toast('photo'); },
      // MDT: «Привязать» chips, the whole Penal Code, removing the record
      recreate: recreate, canRecreate: st !== 'open',
      identPicking: !!S.identPick && st === 'open', identClose: function () { self.setState({ identPick: false }); },
      identSet: function (r) { x.kind = 'person'; x.title = r.name; x.sub = (r.code ? r.code + ' · ' : '') + 'личность установлена'; x.mainImg = r.photo || ''; x.links = [['Личное дело', r.name + (r.code ? ' · ' + r.code : ''), 'person']].concat(x.links); self.setState({ identPick: false, log: logAdd(x.id, 'Личность установлена: ' + r.name + (r.code ? ' (' + r.code + ')' : '')) }); toast('ident'); },
      alMove: function (a, b) { var l = (S.alF || AL0).map(function (r) { return r.slice(); }); if (a === b || a < 0 || a >= l.length) return; var it = l.splice(a, 1)[0]; l.splice(b, 0, it); self.setState({ alF: l }); },
      bulMove: function (a, b) { var l = (S.bR || BULRECS).slice(); if (a === b || a < 0 || a >= l.length) return; var it = l.splice(a, 1)[0]; l.splice(b, 0, it); self.setState({ bR: l }); },
      nLinkList: linkList().map(function (t, i) { return { t: t, del: function () { var l = linkList().slice(); l.splice(i, 1); self.setState({ nLinks: l }); } }; }),
      linkAdd: function (t) { var l = linkList(); if (l.indexOf(t) < 0) self.setState({ nLinks: l.concat([t]) }); },
      pcSelKeys: pcSel,
      pcAdd: function (k, t) { if (!PCN[k]) PCN[k] = t; var m = Object.assign({}, self.state.nPc); m[k] = true; self.setState({ nPc: m, nPcQ: '' }); },
      recCanPick: recCan,
      recClear: function () { self.setState({ nRecNone: true, nRec: null, nSubject: null, nRecPick: false, nDesc: null, nLinks: null }); },
      fv: fv, fon: function (k) { return function (e) { var fs = Object.assign({}, self.state.f); fs[k] = e.target.value; self.setState({ f: fs }); }; },
      recPicking: !!S.nRecPick, recPickKind: CB.kind === 'veh' ? 'vehicle' : 'person',
      recPickOpen: function () { self.setState({ nRecPick: true }); }, recPickClose: function () { self.setState({ nRecPick: false }); },
      recPickSet: function (r) { self.setState({ nRecNone: false, nLinks: null, nRec: r, nSubject: null, nRecPick: false, nDesc: null, nInstr: null, nPc: {}, nPcQ: '' }); },
      ctPicking: !!S.nCtPick, ctPickOpen: function () { self.setState({ nCtPick: true }); }, ctPickClose: function () { self.setState({ nCtPick: false }); },
      ctPickSet: function (ct) { var i = CTS.map(function (q) { return q[0]; }).indexOf(ct[0]); if (i < 0) { CTS.push(ct); i = CTS.length - 1; } self.setState({ nCt: i, nCtPick: false }); },
      alAdd: function () { self.setState({ alF: (S.alF || AL0).concat([['', '']]) }); },
      alAddWith: function (j, val) { var r = ['', '']; r[j] = val; self.setState({ alF: (S.alF || AL0).concat([r]), alFocus: { j: j, n: Date.now() } }); },
      alFocus: S.alFocus || null,
      bulAdd: function () { self.setState({ bR: (S.bR || BULRECS).concat(['']) }); },
      __placeFind: function (e) { if (e.key !== 'Enter') return; var q = e.target.value.trim().toLowerCase(); if (!q) return; var g = GEO.filter(function (p) { return p[0].toLowerCase().indexOf(q) >= 0; })[0]; if (g) self.setState({ pin: { x: g[1], y: g[2] } }); },
      descPh: CBX.desc || '', instrPh: CBX.instr || '', fph: function (k) { return FPH[k] || ''; }, sil: SIL,
      nPlaceVal: S.nPlaceTxt != null ? S.nPlaceTxt : (S.nPlace ? nearest(S.nPlace.x, S.nPlace.y) : ''), placePh: CBX.place ? 'Например: ' + CBX.place : 'Адрес или место',
      onPlace: function (e) { self.setState({ nPlaceTxt: e.target.value }); },
      nE: NE,
      descVal: S.nDesc != null ? S.nDesc : CB.desc, onDesc: function (e) { self.setState({ nDesc: e.target.value }); },
      instrVal: S.nInstr != null ? S.nInstr : CB.instr, onInstr: function (e) { self.setState({ nInstr: e.target.value }); },
      recImg: (CB.photos[0] && PHIMG[CB.photos[0][1]]) || PHIMG.mug,
      nPhotos: CB.photos.concat((S.nUp || []).map(function (u0, i) { var u = photoUrl(u0), k = 'nu' + i; if (u) { PHIMG[k] = u; PHI[k] = PHI.cam; PHB[k] = PHB.cam; } return [photoCap(u0, 'Добавлено вами'), u ? k : 'cam']; })).map(function (p, i) { return { main: i === 0, cap: p[0], icon: PHI[p[1]], hasImg: !!PHIMG[p[1]], noImg: !PHIMG[p[1]], img: PHIMG[p[1]] || '', bg: 'linear-gradient(160deg, ' + PHB[p[1]][0] + ', ' + PHB[p[1]][1] + ')' }; }),
      addPhotoNew: function (url, cap) { self.setState({ nUp: (self.state.nUp || []).concat([typeof url === 'string' ? (cap ? { url: url, cap: cap } : url) : '']) }); },
      goPoster: function () { self.setState({ view: 'poster' }); },
      isPoster: S.view === 'poster',
      pp: (function () {
        var P = S.poster;
        var tpl = P.tpl || autoTpl;
        var T2 = { wanted: ['РАЗЫСКИВАЕТСЯ', 'WANTED', '#B3121D', 'Вы видели этого человека?'], bulletin: ['БЮЛЛЕТЕНЬ БЕЗОПАСНОСТИ', 'AREA SAFETY BULLETIN', '#B3121D', 'Есть информация?'], special: ['ОСОБЫЙ РОЗЫСК', 'MOST WANTED', '#B3121D', 'Вы видели этого человека?'], poi: ['ЛИЦО, ПРЕДСТАВЛЯЮЩЕЕ ИНТЕРЕС', 'PERSON OF INTEREST', '#8A1C1C', 'Знаете, где этот человек?'], alert: ['ОПОВЕЩЕНИЕ НАСЕЛЕНИЯ', 'COMMUNITY ALERT', '#B36B00', 'Есть информация?'], identify: ['ПОМОГИТЕ ОПОЗНАТЬ', 'ATTEMPT TO IDENTIFY', '#B3121D', 'Узнаёте этого человека?'], missing: ['ПРОПАЛ ЧЕЛОВЕК', 'MISSING PERSON', '#1F4E9C', 'Вы видели этого человека?'], stolen: ['УГНАН АВТОМОБИЛЬ', 'STOLEN VEHICLE', '#B36B00', 'Вы видели эту машину?'] };
        var title = P.title || T2[tpl][0];
        var AG = { lspd: ['LOS SANTOS POLICE DEPARTMENT', '#14233F', '#C9A54B', '#0E1A30', 'M10 1.8l6.5 2.6v5.2c0 4.2-2.8 7.2-6.5 8.6-3.7-1.4-6.5-4.4-6.5-8.6V4.4zM10 5.5l1.2 2.5 2.7.4-2 1.9.5 2.7L10 11.7l-2.4 1.3.5-2.7-2-1.9 2.7-.4z'],
                   lssd: ['LOS SANTOS COUNTY SHERIFF', '#2F3A23', '#D2A64A', '#222B19', 'M10 1.5l2 4.2 4.6-.7-2.6 3.9 2.6 3.9-4.6-.7-2 4.2-2-4.2-4.6.7 2.6-3.9L3.4 5l4.6.7z'],
                   sahp: ['SAN ANDREAS HIGHWAY PATROL', '#3A3A3A', '#E0B23C', '#262626', 'M10 1.8l6.5 2.6v5.2c0 4.2-2.8 7.2-6.5 8.6-3.7-1.4-6.5-4.4-6.5-8.6V4.4z'],
                   fib: ['FEDERAL INVESTIGATION BUREAU', '#1C1C1C', '#BFBFBF', '#0F0F0F', 'M10 2a8 8 0 100 16 8 8 0 100-16zM10 5.5l1.2 2.5 2.7.4-2 1.9.5 2.7L10 11.7l-2.4 1.3.5-2.7-2-1.9 2.7-.4z'] }[x.src];
        var EX = PX[x.id] || {};
        var seed = 0; for (var i = 0; i < x.no.length; i++) seed = (seed * 31 + x.no.charCodeAt(i)) % 9973;
        var d = '';
        function sq(px, py, n) { d += 'M' + px + ' ' + py + 'h' + n + 'v' + n + 'h-' + n + 'z'; }
        [[1, 1], [17, 1], [1, 17]].forEach(function (f) { sq(f[0], f[1], 7); d += 'M' + (f[0] + 1) + ' ' + (f[1] + 1) + 'h5v5h-5z'; sq(f[0] + 2, f[1] + 2, 3); });
        for (var yy = 1; yy < 24; yy++) for (var xx = 1; xx < 24; xx++) { var inF = (xx < 9 && yy < 9) || (xx > 15 && yy < 9) || (xx < 9 && yy > 15); if (inF) continue; seed = (seed * 1103 + 12345) % 65536; if (seed % 3 === 0) sq(xx, yy, 1); }
        var ink = P.bw ? '#141414' : T2[tpl][2];
        var internal = P.aud === 'internal', closed = statusOf(x) !== 'open';
        var facts = (EX.facts || x.facts.filter(function (f) { return !/Зона|Действует|Создана|Закрыта/.test(f[0]); }).map(function (f) { return [f[0], f[1]]; })).slice(0, 8);
        return {
          agency: AG[0], band: P.bw ? '#1A1A1A' : AG[1], gold: P.bw ? '#FFFFFF' : AG[2], sealBg: P.bw ? '#000000' : AG[3], seal: AG[4],
          unit: EX.unit || 'Mission Row Station · отдел расследований',
          kindTag: internal ? 'ТОЛЬКО ДЛЯ СОТРУДНИКОВ' : 'ДЛЯ РАСПРОСТРАНЕНИЯ', date: x.created.split(',')[0] + '.2026', caseNo: EX.caseNo || 'Дело ' + x.no,
          title: title, titleEn: T2[tpl][1] + (x.armed && tpl !== 'missing' ? ' · ARMED AND DANGEROUS' : ''), titleSize: (title.length > 22 ? Math.min(44, Math.floor(880 / title.length)) : Math.min(92, Math.floor(740 / Math.max(title.length, 6)))) + 'px', titleWs: title.length > 22 ? 'normal' : 'nowrap', ink: ink,
          wantedFor: EX.wantedFor || (x.reason.charAt(0) + x.reason.slice(1).toLowerCase() + (x.pc.length ? ' (' + x.pc.map(function (n) { return 'PC ' + n; }).join(', ') + ')' : '')),
          name: EX.name || x.title, mainCap: EX.mainCap || (x.photos[0] ? x.photos[0][0] : 'Фото'),
          photoW: x.kind === 'veh' ? '200px' : '128px', photoH: x.kind === 'veh' ? '126px' : '156px',
          showPhotos: P.photos && x.photos.length > 1, extra: x.photos.slice(1, 3).map(function (p) { var im = p[1] === 'mug' && x.mainImg ? x.mainImg : PHIMG[p[1]]; return { cap: p[0], icon: PHI[p[1]], hasImg: !!im, noImg: !im, img: im || '' }; }),
          facts: facts.map(function (f) { return { k: f[0], v: f[1] }; }),
          incident: (EX.incident || [['ДАТА', x.created.split(',')[0] + '.2026'], ['ВРЕМЯ', x.created.split(', ')[1] || '—'], ['МЕСТО', x.seen[0] ? x.seen[0][0] : '—']]).map(function (iv, i) { return { k: iv[0], v: iv[1], sep: i ? '1px solid #141414' : '0' }; }),
          narr: EX.narr || x.desc, showDesc: P.desc, armed: x.armed && tpl !== 'missing', internal: internal,
          ask: x.bulletin ? 'Есть информация?' : x.kind === 'event' ? 'Нужна помощь?' : closed ? 'Спасибо всем, кто помог.' : T2[tpl][3],
          contact: (P.contact ? (EX.contact || 'Звоните 911 или ' + x.ct[0] + ' (' + x.ct[1] + '): ' + x.ct[2] + '.') : 'Позвоните 911.'),
          showTips: P.contact && !internal && x.kind !== 'event', isEvent: x.kind === 'event' && !x.bulletin, isBulletin: !!x.bulletin, notBulletin: !x.bulletin, paras: (EX.paras || []).map(function (t) { return { t: t }; }), recs: (EX.recs || BULRECS).map(function (t, i) { return { t: t, n: (i < 9 ? '0' : '') + (i + 1) }; }), bInc: [['ГДЕ', 'Rockford Hills, Vinewood, Burton'], ['С КАКОГО ВРЕМЕНИ', 'С начала ноября 2026'], ['СЛУЧАЕВ', '9, задержаны 3']].map(function (iv, i) { return { k: iv[0], v: iv[1], sep: i ? '1px solid #000000' : '0' }; }), approved: EX.approved || '', listTitle: EX.listTitle || 'Что советуем жителям', hasApproved: !!EX.approved, notEventDesc: P.desc && x.kind !== 'event', showReward: x.kind !== 'event' && P.reward && !internal && !closed, reward: P.rewardSum, rewardFor: tpl === 'alert' ? 'за информацию' : tpl === 'missing' ? 'за информацию, которая поможет найти' : tpl === 'stolen' ? 'за информацию о местонахождении' : 'за информацию, которая приведёт к аресту', showQr: P.qr, qrCap: internal ? 'открыть в MDT' : 'сообщить онлайн',
          footL: internal ? 'Служебный бюллетень · не для публичного распространения' : 'Выпущено: ' + (x.src === 'lssd' ? 'LSSD · пресс-служба' : x.src === 'fib' ? 'FIB · полевой офис Лос-Сантос' : 'LSPD · пресс-служба'),
          footR: (function () { var v = (x.facts.filter(function (f) { return /Действует/.test(f[0]); })[0] || [0, '—'])[1]; return /отмены/i.test(v) ? 'Действует до отмены' : 'Действует до ' + v; })(),
          hasLogo: x.src === 'lspd' || x.src === 'lssd', noLogo: !(x.src === 'lspd' || x.src === 'lssd'), logo: ASSET['logo-' + x.src] || '', logoF: P.bw ? 'grayscale(1) contrast(1.15)' : 'none', photoF: P.bw ? 'grayscale(1) contrast(1.05)' : 'none',
          hasCiv: x.src !== 'fib', civSeal: ASSET['seal-' + ({ lspd: 'city', lssd: 'county', sahp: 'state' }[x.src] || 'state')], noCiv: x.src === 'fib', civName: { lspd: 'CITY OF LOS SANTOS', lssd: 'COUNTY OF LOS SANTOS', sahp: 'STATE OF SAN ANDREAS' }[x.src] || '',
          stamp: closed, stampText: x.kind === 'missing' ? 'НАЙДЕНА' : x.kind === 'veh' ? 'НАЙДЕН' : 'ЗАДЕРЖАН'
        };
      })(),
      ppTpls: [['wanted', 'Розыск'], ['special', 'Особый розыск'], ['poi', 'Лицо интереса'], ['identify', 'Опознать'], ['missing', 'Пропал'], ['stolen', 'Угон'], ['alert', 'Оповещение'], ['bulletin', 'Бюллетень']].map(function (t) {
        var on = (S.poster.tpl || autoTpl) === t[0]; return { t: t[1], bg: on ? c.sel : c.card, ring: on ? 'inset 0 0 0 2px ' + accent : 'none', fw: on ? 600 : 400, pick: function () { self.setState({ poster: Object.assign({}, self.state.poster, { tpl: t[0], title: '' }) }); } }; }),
      onPpTitle: function (e) { self.setState({ poster: Object.assign({}, self.state.poster, { title: e.target.value }) }); },
      onPpReward: function (e) { self.setState({ poster: Object.assign({}, self.state.poster, { rewardSum: e.target.value }) }); },
      ppToggles: [['photos', 'Дополнительные фото', 'до двух под главным'], ['desc', 'Приметы текстом', 'описание из ориентировки'], ['reward', 'Награда', 'сумма крупно внизу'], ['contact', 'Контакты', 'следователь, участок, анонимная линия']].filter(function (t) { return x.kind !== 'event' || t[0] === 'contact'; }).map(function (t) {
        var on = !!S.poster[t[0]]; return { t: t[1], sub: t[2], bg: on ? accent : 'transparent', border: on ? accent : c.stroke2, knob: on ? onAccent : c.text2, x: on ? '20px' : '0px', pick: function () { var p = Object.assign({}, self.state.poster); p[t[0]] = !on; self.setState({ poster: p }); } }; }),
      ppColor: [['Цветная', false], ['Чёрно-белая', true]].map(function (t) { var on = S.poster.bw === t[1]; return { t: t[0], bg: on ? c.btn : 'transparent', fg: on ? c.text : c.text2, fw: on ? 600 : 400, pick: function () { self.setState({ poster: Object.assign({}, self.state.poster, { bw: t[1] }) }); } }; }),
      ppAud: [['public', 'Для жителей'], ['internal', 'Служебная']].map(function (t) { var on = (S.poster.aud || 'public') === t[0]; return { t: t[1], bg: on ? c.btn : 'transparent', fg: on ? c.text : c.text2, fw: on ? 600 : 400, pick: function () { self.setState({ poster: Object.assign({}, self.state.poster, { aud: t[0] }) }); } }; }),
      ppAudText: (S.poster.aud || 'public') === 'internal' ? 'Для стенда в участке: без награды и анонимной линии, с инструкцией «При обнаружении».' : 'Для расклейки: награда, анонимная линия, без служебных инструкций.',
      ppPdf: function () { toast('pdf'); }, ppPrint: function () { toast('print'); }, ppMail: function () { toast('mail'); },
      navGroups: navGroups, goNew: function () { self.setState({ view: 'new', dlg: null }); }, goFeed: function () { self.setState({ view: 'feed' }); },
      isFeed: S.view === 'feed', isMap: S.view === 'map', isNew: S.view === 'new',
      listTitle: curNav[1], listCount: list.length + ' ' + plRu(list.length, 'ориентировка', 'ориентировки', 'ориентировок'),
      q: S.q, onQ: function (e) { self.setState({ q: e.target.value }); }, rows: rows, noRows: rows.length === 0, filtered: !!(S.q.trim() || S.src !== 'all'), resetFilters: function () { self.setState({ q: '', src: 'all' }); }, b: b,
      ack: function () { var o = Object.assign({}, self.state.acked); o[x.id] = true; self.setState({ acked: o }); },
      openSeen: function () { self.setState({ dlg: 'seen', sf: {} }); }, closeSeen: function () { self.setState({ dlg: null }); },
      sendSeen: function () {
        var sp = self.state.seenPin || GPS, sf = self.state.sf || {}, bk = self.state.backup;
        var DIRS = ['На север', 'На юг', 'На восток', 'На запад', 'Стоит на месте'], HOW = ['Пешком', 'В Bravado Bison', 'В другой машине'];
        var place = String(sf.place != null ? sf.place : (self.state.seenPin ? nearest(sp.x, sp.y) + accTxt(sp.r) : 'Grove St / Forum Dr, Davis')).trim() || nearest(sp.x, sp.y);
        var how = HOW.filter(function (t, i) { return (self.state.how || {})[i]; }).join(', ');
        var note = [DIRS[self.state.dir], how, String(sf.note || '').trim()].filter(Boolean).join('. ') + (bk ? '. Запрошена поддержка.' : '');
        var when = String(sf.when || '').trim(); when = !when || /^Сейчас/.test(when) ? nowStr() : when;
        var add = Object.assign({}, self.state.seenAdd); add[x.id] = (add[x.id] || []).concat([[place, when, note, 'Вы · ' + ME(), sp.x, sp.y]]);
        self.setState({ seenAdd: add, dlg: null, seenPin: null, sf: {}, backup: false, log: logAdd(x.id, 'Отметка «Замечен»: ' + place) }); toast(bk ? 'backup' : 'seen'); },
      sfv: function (k, d) { var sf = S.sf || {}; return sf[k] != null ? sf[k] : d; },
      sfon: function (k) { return function (e) { var sf = Object.assign({}, self.state.sf); sf[k] = e.target.value; self.setState({ sf: sf }); }; },
      __now: nowStr(),
      seenDlg: S.dlg === 'seen', closeDlg: S.dlg === 'close',
      dirs: pills(['На север', 'На юг', 'На восток', 'На запад', 'Стоит на месте'], S.dir, 'dir'),
      how: pills(['Пешком', 'В Bravado Bison', 'В другой машине'], S.how, 'how', true),
      toggleBackup: function () { self.setState({ backup: !self.state.backup }); },
      backupBg: S.backup ? TN.red[0] : c.card, backupFg: S.backup ? TN.red[1] : c.text, bTogBg: S.backup ? TN.red[1] : 'transparent', bTogBorder: S.backup ? TN.red[1] : c.stroke2, bKnob: S.backup ? '#000000' : c.text2, bX: S.backup ? '20px' : '0px',
      toggleMenu: function () { self.setState({ menu: !self.state.menu, menuAcc: false, menuVid: false }); }, menuOpen: S.menu,
      menuItems: (st !== 'open' ? [['Создать заново по этой карточке', 'M10 4v12M4 10h12', recreate], ['Скопировать текст для рации', 'M7 7h9v10H7zM4 13V3h9', copyRadio]]
        : S.menuVid ? (x.kind === 'veh' ? ['wanted', 'poi'] : x.kind === 'missing' ? ['missing', 'wanted', 'poi'] : ['wanted', 'special', 'poi', 'missing']).map(function (vv) { return [(x.vid === vv ? '✓ ' : '') + VID[vv][0], 'M4 7h12M4 13h12M13 4l3 3-3 3M7 10l-3 3 3 3', function () { var was = VID[x.vid][0]; x.vid = vv; self.setState({ menu: false, menuVid: false, log: logAdd(x.id, 'Основание: ' + VID[vv][0].toLowerCase() + ' вместо «' + was + '»') }); toast('vid'); }]; }).concat([['Назад', 'M12.5 4.5L7 10l5.5 5.5', function () { self.setState({ menuVid: false }); }]])
        : S.menuAcc ? ACCS.map(function (a) { var cur = (accOf(x) || 'все агентства').toLowerCase() === a[0].toLowerCase(); return [(cur ? '✓ ' : '') + a[0], 'M5.5 9V6.5a4.5 4.5 0 019 0V9M4 9h12v8.5H4z', function () { var o = Object.assign({}, self.state.accOv); o[x.id] = a[0] === 'Все агентства' ? null : a[0].charAt(0).toLowerCase() + a[0].slice(1); self.setState({ accOv: o, menu: false, menuAcc: false, log: logAdd(x.id, 'Доступ: ' + a[0].charAt(0).toLowerCase() + a[0].slice(1)) }); toast('acc'); }]; }).concat([['Назад', 'M12.5 4.5L7 10l5.5 5.5', function () { self.setState({ menuAcc: false }); }]]) : [['Обновить ориентировку', 'M4 14.5V16h1.5L15 6.5 13.5 5zM12 6.5l1.5 1.5', function () { self.setState({ menu: false, dlg: 'update' }); }],
        ['Продлить на 24 ч', 'M10 17.5a7.5 7.5 0 100-15 7.5 7.5 0 000 15zM10 6v4l2.5 1.5', function () { var o = Object.assign({}, self.state.ext); o[x.id] = '18.11, 20:00'; self.setState({ menu: false, ext: o, log: logAdd(x.id, 'Продлена до 18.11, 20:00') }); toast('ext'); }],
        ['Доступ: ' + (accOf(x) || 'все агентства'), 'M5.5 9V6.5a4.5 4.5 0 019 0V9M4 9h12v8.5H4z', function () { self.setState({ menuAcc: true }); }],
        ['Скопировать текст для рации', 'M7 7h9v10H7zM4 13V3h9', function () { var t = 'Всем экипажам, ориентировка ' + x.no + ', ' + PRIO[x.prio][0].toLowerCase() + ' приоритет: ' + x.title + (x.plate ? ', номер ' + x.plate : '') + '. ' + (x.desc || '') + (x.armed ? ' Вооружён и опасен.' : '') + (x.instr ? ' ' + x.instr : ''); if (navigator.clipboard) navigator.clipboard.writeText(t).catch(function () {}); self.setState({ menu: false }); toast('radio'); }]].concat(x.kind === 'unknown' ? [['Личность установлена: привязать человека', 'M10 9a3.2 3.2 0 100-6.4A3.2 3.2 0 0010 9zM3.5 17.5c0-3.6 2.9-6 6.5-6s6.5 2.4 6.5 6', function () { self.setState({ menu: false, identPick: true }); }]] : []).concat(x.kind === 'event' ? [] : [['Сменить основание', 'M4 7h12M4 13h12M13 4l3 3-3 3M7 10l-3 3 3 3', function () { self.setState({ menuVid: true }); }]])).map(function (m) { return { t: m[0], icon: m[1], go: m[2] }; }),
      updDlg: S.dlg === 'update', updAckN: String(ack),
      updWhat: (x.kind === 'event' ? (x.bulletin ? ['Текст', 'Рекомендации', 'Районы', 'Контакты'] : ['Пункты', 'Уровень опасности', 'Что делать жителям', 'Зона']) : x.kind === 'veh' ? ['Фото', 'Номер или приметы машины', 'Последнее место', 'Инструкция', 'Основание или статья'] : ['Фото', 'Транспорт', 'Последнее место', 'Приметы', 'Инструкция', 'Основание или статья']).map(function (t, i) { var on = !!S.updWhat[i]; return { t: t, bg: on ? (dark ? '#FFFFFF' : '#1B1B1B') : c.btn, fg: on ? (dark ? '#1B1B1B' : '#FFFFFF') : c.text, fw: on ? 600 : 400, pick: function () { var m = Object.assign({}, self.state.updWhat); m[i] = !m[i]; self.setState({ updWhat: m }); } }; }),
      updEditors: (function () {
        var E = S.updEdits || {}, W = S.updWhat || {}, out = [], K = UPDK(x);
        var val = function (k, cur) { return E[k] != null ? E[k] : cur; };
        K.forEach(function (key, i) {
          if (!W[i] || !key) return;
          if (key === 'photo') out.push({ key: 'photo', label: 'Фото', type: 'photo', value: E.photo ? 'Добавлено' : '' });
          if (key === 'veh') out.push({ key: 'veh', label: 'Транспорт', type: 'text', ph: 'Марка, цвет, номер', value: val('veh', factOf(x, 'Транспорт')) });
          if (key === 'plate') { out.push({ key: 'plate', label: 'Номер', type: 'text', ph: '87PLN903', value: val('plate', x.plate || '') }); out.push({ key: 'desc', label: 'Приметы машины', type: 'area', value: val('desc', x.desc || '') }); out.push({ key: 'tags', label: 'Особые приметы — через запятую', type: 'text', value: val('tags', (x.tags || []).join(', ')) }); }
          if (key === 'place') out.push({ key: 'place', label: 'Последнее место', type: 'text', ph: 'Улица, район · когда видели', value: val('place', factOf(x, 'Последнее место')) });
          if (key === 'desc') { out.push({ key: 'desc', label: x.kind === 'event' ? 'Текст' : 'Приметы', type: 'area', value: val('desc', x.desc || '') }); if (x.kind !== 'event') out.push({ key: 'tags', label: 'Особые приметы — через запятую', type: 'text', value: val('tags', (x.tags || []).join(', ')) }); }
          if (key === 'instr') out.push({ key: 'instr', label: x.kind === 'event' ? 'Что делать' : 'Инструкция при обнаружении', type: 'area', value: val('instr', x.instr || '') });
          if (key === 'zone') out.push({ key: 'zone', label: 'Зона', type: 'text', value: val('zone', factOf(x, 'Где') || factOf(x, 'Зона')) });
          if (key === 'basis') { out.push({ key: 'vid', label: 'Основание', type: 'choice', value: val('vid', x.vid), opts: (x.kind === 'veh' ? ['wanted', 'poi'] : x.kind === 'missing' ? ['missing'] : ['wanted', 'special', 'poi']).map(function (k) { return [k, VID[k][0]]; }) }); out.push({ key: 'pc', label: 'Статьи Penal Code — номера через запятую', type: 'text', ph: '216, 207', value: val('pc', (x.pc || []).join(', ')) }); }
        });
        return out;
      })(),
      updEditSet: function (k, v) { var e = Object.assign({}, self.state.updEdits); e[k] = v; self.setState({ updEdits: e }); },
      updTextVal: S.updText === null ? (x.updDraft || '') : S.updText, onUpdText: function (e) { self.setState({ updText: e.target.value }); },
      updChecks: [['updNotify', 'Уведомить ознакомившихся · ' + ack, 'Всплывёт у них с пометкой «Обновлена»'], ['updReack', 'Попросить ознакомиться заново', 'Счётчик «Ознакомились» начнётся с нуля']].map(function (k) { var on = !!S[k[0]]; return { t: k[1], sub: k[2], on: on, bg: on ? accent : 'transparent', border: on ? accent : c.stroke2, pick: function () { var o = {}; o[k[0]] = !on; self.setState(o); } }; }),
      cancelUpd: function () { self.setState({ dlg: null, updText: null, updEdits: {} }); },
      confirmUpd: function () { var done = applyUpd(x, self.state.updEdits || {}); var w = done.length ? done : UPDW(x).filter(function (t, i) { return self.state.updWhat[i]; }).map(function (t) { return t.toLowerCase(); }); var t = (self.state.updText === null ? (x.updDraft || '') : self.state.updText); var o = Object.assign({}, self.state.updated); o[x.id] = 'Обновлено: ' + (w.join(', ') || 'описание') + (t ? '. ' + t : ''); var rk = Object.assign({}, self.state.reack), ak = Object.assign({}, self.state.acked); if (self.state.updReack) { rk[x.id] = true; delete ak[x.id]; }
        self.setState({ updated: o, dlg: null, updText: null, updEdits: {}, reack: rk, acked: ak, log: logAdd(x.id, o[x.id] + (self.state.updReack ? ' · попросили ознакомиться заново' : '')) }); toast('upd'); },
      closeBolo: function () { self.setState({ dlg: 'close' }); }, cancelClose: function () { self.setState({ dlg: null, closeArrest: null, closeNote: '', closeNoteErr: false }); },
      closeReasons: (x.kind === 'event' ? [['Угроза миновала', 'Ситуация под контролем, ограничения сняты'], ['Заменено новым оповещением', 'Ссылка на новое появится в карточке'], ['Ошибка или дубль', 'Оповещение создано по ошибке']] : x.kind === 'missing' ? [['Найден', 'Жив, передан родственникам или EMS'], ['Вернулся сам', 'По сообщению родственников'], ['Ошибка или дубль', 'Ориентировка создана по ошибке']]
        : x.kind === 'veh' ? [['Найдена', 'Машина обнаружена, на штрафстоянке или у владельца'], ['Отменена владельцем', 'Заявление отозвано'], ['Ошибка или дубль', 'Ориентировка создана по ошибке']]
        : [['Задержан', 'Привяжите арест, чтобы ссылка появилась в карточке'], ['Снят с розыска', 'Ордер отозван или основание отпало'], ['Ошибка или дубль', 'Ориентировка создана по ошибке']]).map(function (r, i) { var on = S.closeWhy === i; return { t: r[0], sub: r[1], bg: on ? c.sel : c.card, ring: on ? 'inset 0 0 0 1px ' + c.stroke2 : 'none', radio: on ? '5px solid ' + accent : '1.5px solid ' + c.stroke2, pick: function () { self.setState({ closeWhy: i, closeNoteErr: false }); } }; }),
      closeArrestOn: x.kind !== 'event' && x.kind !== 'missing' && x.kind !== 'veh' && (S.closeWhy || 0) === 0, closeArrest: S.closeArrest || null, closeArrestFor: x.title || '',
      closeArrestSet: function (a) { self.setState({ closeArrest: a }); },
      seenDelete: function (key, why) { var s = seenOf(x).filter(function (r) { return seenKey(r) === key; })[0]; if (!s) return; var d = Object.assign({}, self.state.seenDel); d[x.id] = (d[x.id] || []).concat([key]); self.setState({ seenDel: d, log: logAdd(x.id, 'Удалена отметка «Замечен»: ' + s[0] + ', ' + s[1] + ' (' + s[3].replace(/^Вы · /, '') + ')' + (why ? ' — ' + why : '')) }); toast('seenDel'); },
      closeNoteOn: (S.closeWhy || 0) !== 0, closeNote: S.closeNote || '', closeNoteErr: !!S.closeNoteErr, closeNoteSet: function (t) { self.setState({ closeNote: t, closeNoteErr: false }); },
      confirmClose: function () { if ((self.state.closeWhy || 0) !== 0 && !String(self.state.closeNote || '').trim()) { self.setState({ closeNoteErr: true }); return; } var r = x.kind === 'event' ? ['Угроза миновала', 'Заменено', 'Ошибка'] : x.kind === 'missing' ? ['Найден', 'Вернулся сам', 'Ошибка'] : x.kind === 'veh' ? ['Найдена', 'Отменена владельцем', 'Ошибка'] : ['Задержан', 'Снят с розыска', 'Ошибка']; var o = Object.assign({}, self.state.closed); o[x.id] = r[self.state.closeWhy]; var arr = r[self.state.closeWhy] === 'Задержан' ? self.state.closeArrest : null, oa = Object.assign({}, self.state.closedArr); if (arr) oa[x.id] = arr; var note = (self.state.closeWhy || 0) !== 0 ? String(self.state.closeNote || '').trim() : '', cn = Object.assign({}, self.state.closedNote); if (note) cn[x.id] = note; self.setState({ closed: o, closedArr: oa, closedNote: cn, closeArrest: null, closeNote: '', closeNoteErr: false, dlg: null, nav: 'closed', sel: x.id, log: logAdd(x.id, 'Закрыта: ' + o[x.id].toLowerCase() + (arr ? ' · арест ' + arr.split(' · ')[0] : '') + (note ? ' — ' + note : '')) }); toast('closed'); },
      mapFilters: MF.map(function (f) { var on = S.mapF === f[0]; return { t: f[1], bg: on ? (dark ? '#FFFFFF' : '#1B1B1B') : c.card, fg: on ? (dark ? '#1B1B1B' : '#FFFFFF') : c.text, fw: on ? 600 : 400, pick: function () { self.setState({ mapF: f[0] }); } }; }),
      mapPins: mapPins, mapTrails: mapTrails, mapList: mapList,
      mapLegend: [{ t: 'Высокий приоритет', c: TN.red[1] }, { t: 'Средний', c: TN.amber[1] }, { t: 'Пропавшие', c: TN.blue[1] }],
      openFromMap: function () { self.setState({ view: 'feed', nav: 'active', sel: selMap.id }); },
      nObjs: NOBJ.map(function (o, i) { var on = (S.nObj || 0) === i; return { t: o[0], sub: o[1], icon: o[2], bg: on ? c.sel : c.card, ring: on ? 'inset 0 0 0 2px ' + accent : 'none', fw: on ? 600 : 400, pick: function () { var cb = NEWC[i][0]; self.setState({ nRecNone: false, nLinks: null, nRec: null, nRecPick: false, nDesc: null, nInstr: null, nObj: i, nBas: 0, nPc: {}, armed: false, nEx: {}, nPlaceTxt: null, nTried: false, nPrio: cb.prio, nDup: false, nTerm: cb.kind === 'event' ? 0 : cb.kind === 'missing' ? 3 : 2 }); } }; }),
      nBases: NEWC[S.nObj || 0].map(function (b, i) { var on = (S.nBas || 0) === i; return { t: b.t, bg: on ? (dark ? '#FFFFFF' : '#1B1B1B') : c.btn, fg: on ? (dark ? '#1B1B1B' : '#FFFFFF') : c.text, fw: on ? 600 : 400, pick: function () { self.setState({ nRecNone: false, nLinks: null, nDesc: null, nInstr: null, nBas: i, nPc: {}, armed: false, nEx: {}, nPlaceTxt: null, nTried: false, nPrio: b.prio, nDup: false, nTerm: b.kind === 'event' ? (b.bulletin ? 3 : 0) : b.kind === 'missing' ? 3 : 2 }); } }; }), nBasHint: CB.hint,
      recLabel: CB.kind === 'veh' ? 'Из базы DMV' : CB.rec ? 'Из базы' : 'Личность', recCard: !!CB.rec && !dupOn,
      dupName: DB.title + ' · ' + DB.plate, dupSub: (DUPB ? 'Из DMV: ' + SJ.sub : 'Из DMV: жёлтый, владелец Lee Han'), dupTitle: 'На этот номер уже есть ориентировка ' + DB.no,
      dupMeta: VID[DB.vid][0] + ' · ' + DB.reason.toLowerCase() + ' · ' + SRC[DB.src][0] + ', ' + DB.author + ' · ' + DB.ago + ' назад · ' + DB.ack[0] + ' из ' + DB.ack[1] + ' ознакомились', recNone: !CB.rec && CB.kind !== 'event', recMug: !!CB.rec && !CB.car, recCar: !!CB.car, recCarImg: CB.car ? vehiclePhoto(CB.rec ? CB.rec[0] : (CB.title || ''), CB.rec ? CB.rec[1] : (CB.carColor || '')) : '', recBg: CB.car ? c.photoSky : c.mug, recName: CB.rec ? CB.rec[0] : '', recSub: CB.rec ? CB.rec[1] : (CB.recSub || ''), prevUnknown: CB.kind === 'unknown',
      recHint: CB.rec ? 'Данные подставлены из записи MDC. «Другой» — выбрать другую запись, «Убрать» — без записи.' : CBX.rec ? (CB.kind === 'veh' ? 'Машина из базы DMV подставит номер и описание.' : 'Человек из базы подставит фото и данные из личного дела.') : 'Если личность установят, ориентировку можно перевести на человека из базы.',
      hasExtra: CB.extra.length > 0, nExtra: CB.extra.map(function (e, i) { var ex = S.nEx || {}; return { k: e[0], v: ex[e[0]] != null ? ex[e[0]] : e[1], ph: ((CBX.extra || [])[i] || [])[1] || '', on: function (ev) { var o = Object.assign({}, self.state.nEx); o[e[0]] = ev.target.value; self.setState({ nEx: o }); } }; }), pcOn: !CB.pcOffText, pcOff: !!CB.pcOffText, pcOffText: CB.pcOffText || '', nLinks: CB.links.map(function (t) { return { t: t }; }),
      armedOk: CB.armedOk, armedLabel: CB.armedLabelV || 'Вооружён и опасен', descLabel: CB.kind === 'veh' ? 'Как выглядит машина' : 'Приметы', descText: CB.desc,
      placeLabel: CB.dup || CB.tpl === 'stolen' ? 'Где угнана' : CB.tpl === 'identify' ? 'Где нашли' : CB.kind === 'veh' ? 'Где видели машину' : 'Последний раз видели', instrLabel: CB.kind === 'missing' ? 'Что делать, если нашли' : CB.tpl === 'identify' ? 'Если узнали' : 'Что делать при обнаружении', instrText: CB.instr,
      nVids: VIDS.map(function (v, i) { var on = NVI === i; return { t: VID[v][0], bg: on ? (dark ? '#FFFFFF' : '#1B1B1B') : c.btn, fg: on ? (dark ? '#1B1B1B' : '#FFFFFF') : c.text, fw: on ? 600 : 400, pick: function () { self.setState({ nVid: i }); } }; }),
      nVidHint: VIDHINT[NVI], isAlert: VIDS[NVI] === 'alert', notAlert: VIDS[NVI] !== 'alert', isIncident: CB.kind === 'event' && !CB.bulletin, alFacts: (S.alF || AL0).map(function (e, i, a) { return { k: e[0], v: e[1], onK: edAl(a, i, 0), onV: edAl(a, i, 1), del: function () { self.setState({ alF: a.filter(function (_, j) { return j !== i; }) }); } }; }), alQuick: ['Эвакуация', 'Медпомощь', 'Электричество', 'Транспорт', 'Горячая линия'].map(function (t) { return { t: t, add: function () { self.setState({ alF: (S.alF || AL0).concat([[t, '']]) }); } }; }), isBulletin: !!CB.bulletin, showBases: NEWC[S.nObj || 0].length > 1, bulRecs: (S.bR || BULRECS).map(function (t, i, a) { return { n: (i < 9 ? '0' : '') + (i + 1), t: t, sep: c.stroke, onT: function (e) { var n = a.slice(); n[i] = e.target.value; self.setState({ bR: n }); }, del: function () { self.setState({ bR: a.filter(function (_, j) { return j !== i; }) }); } }; }), notBulletinNew: !CB.bulletin, nAks: ['Наводнение', 'Пожар', 'Утечка газа', 'Перекрытие дорог', 'Отключение света', 'Опасный район', 'Другое'].map(function (t, i) { var on = (S.nAk || 0) === i; return { t: t, bg: on ? (dark ? '#FFFFFF' : '#1B1B1B') : c.btn, fg: on ? (dark ? '#1B1B1B' : '#FFFFFF') : c.text, fw: on ? 600 : 400, pick: function () { self.setState({ nAk: i }); } }; }), nLvls: ['Внимание', 'Опасно', 'Эвакуация'].map(function (t, i) { var on = (S.nLv == null ? 1 : S.nLv) === i; return { t: t, bg: on ? [c.btn, TN.amber[0], TN.red[0]][i] : 'transparent', fg: on ? [c.text, TN.amber[1], TN.red[1]][i] : c.text2, fw: on ? 600 : 400, pick: function () { self.setState({ nLv: i, nPrio: i }); } }; }), nPcOff: NVI >= 3,
      nPcSel: pcSel.map(function (k) { return { n: 'PC ' + k, t: PCN[k], del: function () { var m = Object.assign({}, self.state.nPc); delete m[k]; self.setState({ nPc: m }); } }; }),
      nPcSug: pcSug.map(function (k) { return { n: 'PC ' + k, t: PCN[k], add: function () { var m = Object.assign({}, self.state.nPc); m[k] = true; self.setState({ nPc: m, nPcQ: '' }); } }; }),
      onPcQ: function (e) { self.setState({ nPcQ: e.target.value }); },
      nCts: CTS.map(function (ct, i) { var on = S.nCt === i; return { name: ct[0], role: ct[1], phone: ct[2], tag: ct[3], bg: on ? c.sel : c.card, ring: on ? 'inset 0 0 0 1px ' + accent : 'none', radio: on ? '5px solid ' + accent : '1.5px solid ' + c.text2, pick: function () { self.setState({ nCt: i }); } }; }),
      nDup: dupOn, noDup: !dupOn,
      dupToggle: function () { self.setState({ nDup: false, nRecPick: true }); },
      dupOpen: function () { self.setState({ view: 'feed', nav: 'active', sel: DB.id, nDup: false }); },
      dupAdd: function () { var sk = Object.assign({}, self.state.dupSkip); sk[DB.id] = true; self.setState({ view: 'feed', nav: 'active', sel: DB.id, nDup: false, dupSkip: sk, dlg: 'update', updWhat: { 3: true }, updText: 'Дополнение: ' + (S.nDesc != null ? S.nDesc : CB.desc) }); },
      dupIgnore: function () { var sk = Object.assign({}, self.state.dupSkip); sk[DB.id] = true; self.setState({ nDup: false, dupSkip: sk }); },
      nAccs: ACCS.map(function (a, i) { var on = S.nAcc === i; return { t: a[0], bg: on ? c.btn : 'transparent', fg: on ? c.text : c.text2, fw: on ? 600 : 400, pick: function () { self.setState({ nAcc: i }); } }; }),
      nAccHint: ACCS[S.nAcc][1],
      nTypes: nTypes, nReasons: pills(REASONS, S.nReason, 'nReason'), nPrio: nPrio,
      toggleArmed: function () { self.setState({ armed: !self.state.armed }); },
      armedBg: S.armed ? TN.red[0] : c.card, armedFg: S.armed ? TN.red[1] : c.text, armTogBg: S.armed ? TN.red[1] : 'transparent', armTogBorder: S.armed ? TN.red[1] : c.stroke2, armKnob: S.armed ? '#000000' : c.text2, armX: S.armed ? '20px' : '0px',
      nTerm: seg(TERMS, S.nTerm, 'nTerm'), nZones: pills(ZONES, S.nZone, 'nZone', true),
      nSend: (CB.kind === 'event' ? [['Уведомление на телефоны всем жителям', 0]] : [['Всем на смене в MDT, высокий приоритет — всплывающим окном', 0], ['Диспетчер зачитает в рацию', 1], ['Письмо в Почту отделу расследований', 2]]).map(function (o) { var on = !!S.nSend[o[1]]; return { t: o[0], on: on, bg: on ? accent : 'transparent', border: on ? accent : c.stroke2, pick: function () { var m = Object.assign({}, self.state.nSend); m[o[1]] = !on; self.setState({ nSend: m }); } }; }),
      prevSub: CB.t + ' · ' + (zonesOn.join(', ') || 'зона не выбрана') + ' · ' + TERMS[S.nTerm].toLowerCase(),
      prevChips: [chip(prioT, ['grey', 'amber', 'red'][S.nPrio])].concat(S.armed ? [chip('Вооружён и опасен', 'red')] : []),
      prevName: CB.bulletin ? fv('bSub') || 'Без заголовка' : CB.kind === 'event' ? fv('alTitle') || 'Без заголовка' : CB.rec ? CB.rec[0].split(' · ')[0] : 'Неизвестный', radioText: (function () {
        var dsc = String(S.nDesc != null ? S.nDesc : CB.desc).trim(), arm = S.armed ? ' Вооружён, соблюдать осторожность.' : '';
        if (CB.kind === 'event') { var tt = CB.bulletin ? fv('bSub') : fv('alTitle'); return 'Всем экипажам: ' + (CB.bulletin ? 'бюллетень безопасности' : 'оповещение населения') + (tt ? ', ' + tt : '') + '.' + (!CB.bulletin && fv('alDesc') ? ' ' + fv('alDesc') : ''); }
        if (CB.radio) return CB.radio.replace('%P', prioT.toLowerCase()) + arm;
        return 'Всем экипажам, ориентировка, ' + prioT.toLowerCase() + ' приоритет: ' + (CB.kind === 'veh' ? 'неизвестная машина' : 'неизвестный') + '.' + (dsc ? ' ' + dsc : ' Приметы не указаны.') + arm;
      })(),
      publish: function () {
        if (Object.keys(formErrors()).length) { self.setState({ nTried: true }); return; }
        var rec = makeNew();
        self.setState({ made: (S.made || []).concat([rec]), view: 'feed', nav: 'mine', q: '', src: 'all', sel: rec.id, nSubject: null, nRec: null, nRecNone: false, nLinks: null, nDesc: null, nInstr: null, nPlace: null, nPlaceTxt: null, nEx: {}, nTried: false, nPhotoN: 2, nUp: null, nPc: {}, f: {}, alF: null, bR: null });
        toast('pub'); },
      toast: !!S.toast,
      toastTitle: { seenDel: 'Отметка удалена', vid: 'Основание изменено', ident: 'Личность установлена', acc: 'Доступ изменён', seen: 'Отметка отправлена', backup: 'Отметка и запрос поддержки отправлены', closed: 'Ориентировка закрыта', pub: 'Ориентировка опубликована', photo: 'Фото добавлено', pdf: 'PDF готов', print: 'Отправлено на печать', mail: 'Листовка отправлена', ext: 'Ориентировка продлена', upd: 'Ориентировка обновлена', radio: 'Текст скопирован' }[S.toast] || '',
      toastText: { seenDel: 'Её больше нет на карте и в списке, причина — в истории ориентировки.', vid: 'Карточка и листовка показывают новое основание.', ident: 'Ориентировка переведена на человека из базы.', acc: 'Карточку видят: ' + (accOf(x) || 'все агентства') + '.', seen: 'Автор ориентировки и все на смене увидят её на карте.', backup: 'Диспетчер создал вызов с вашей позицией.', closed: 'Все на смене получили уведомление, карточка ушла в архив.', pub: 'Разослано на смену, диспетчер получил текст для рации.', photo: 'Его увидят все, кто откроет ориентировку.', pdf: 'BOLO-' + x.no.slice(2) + '.pdf сохранён, можно печатать.', mail: 'PDF ушёл в Почту участку для печати.', print: 'В игре вы получите предмет с распечаткой в инвентарь.', ext: 'Срок обновлён в карточке, смена получила уведомление.', upd: S.updNotify ? 'Ознакомившиеся получили уведомление «Обновлена».' : 'Изменение сохранено в истории без уведомления.', radio: 'Вставьте в рацию или зачитайте на канале.' }[S.toast] || ''
    };
  }
}

export { Component as BoloLogic, BOLOS, EVENTS }
