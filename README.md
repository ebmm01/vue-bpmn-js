# vue-bpmn-js

Front-end do projeto [vue-bpmn-js](https://vue-bpmnjs.netlify.app/#/) - um editor colaborativo para criação de workflows e execução de processos. O projeto é uma POC (Proof of concept), servindo como vitrine para a criação de orquestradores client-side.

O projeto é feito em vue, e se comunica com um servidor back-end feito com nodejs (express). Ele utiliza o componente [bpmn-js](https://bpmn.io/toolkit/bpmn-js/) para a parte do editor, Vuex para a comunicação centralizada de dados entre os SFC (single file components vue) e Vuetify para a estilização.

Para a parte de colaboração em tempo real foi utilizado Websockets. Você pode testá-la abrindo duas abas com o projeto, ambos no mesmo workflow, e editá-lo em uma aba. As mudanças serão refletidas instantâneamente na outra aba, e isso funciona também entre dispositivos conectados em diferentes redes.
