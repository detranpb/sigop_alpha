<template>
    <!-- O main sempre vai ser 100% do viewheitgh - (cabeçalho+rodapé)-->
    <main>
       <div class="text-top"><b> Videos Novos toda quinta as 20h </b></div>
        <a href="https://detran.pb.gov.br/" target="_blank">
           <img alt="DETRAN" id="subscribe" 
                src="https://raw.githubusercontent.com/william-costa/wdev-mock-site-resources/master/assets/images/subscribe.svg">
        </a>
        <div class="text-bottom"> OK okokokokokokokok </div>
    </main>
</template>

<script>
    export default{
        name: 'MyHome'
    }
</script>

<style scoped>

    main{
        background-color: var(--color-background-home);
        justify-content: center;
        align-items:center;
    }

    .text-top{
        color: var(--color-text-light);
        font-size: 22px;
        margin-bottom: 20px;
    }
    #subscribe{
        width:340px;
    }
    .text-bottom{
        color: var(--color-text-light);
        font-size: 18px;
        margin-top: 20px;
    }

    /* Aumenta largura da IMG, qdo em telas comprimento >= 600px (DESKTOP)*/
    @media(min-width:600px) {
            #subscribe{
                width: 500px; 
            }
    }
</style>