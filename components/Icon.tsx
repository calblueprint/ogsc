import React from "react";

export type IconType =
  | "academics"
  | "athletics"
  | "book"
  | "calendar"
  | "lightning"
  | "school"
  | "shoe"
  | "star"
  | "note"
  | "plus"
  | "profile"
  | "back"
  | "next"
  | "edit";

const IconSvgs: Record<IconType, React.ReactElement> = {
  academics: (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 25 20">
      <path d="M24.81 6.6a1.63 1.63 0 00-.68-.67L13.64.29a2.39 2.39 0 00-2.28 0L.87 5.93a1.66 1.66 0 00-.68 2.23 1.69 1.69 0 00.68.67l2.42 1.3v2.81a2.4 2.4 0 001.27 2.13l.91.49v1.13l-1 1.74a1 1 0 00.38 1.43 1.08 1.08 0 00.53.14h1.94a1 1 0 001.05-1 1.07 1.07 0 00-.14-.52l-1-1.74v-.24l4.13 2.22a2.39 2.39 0 002.28 0l6.8-3.65a2.4 2.4 0 001.27-2.13v-2.81l2.42-1.3a1.66 1.66 0 00.68-2.23zM5.5 13.55h-.08a.64.64 0 01-.34-.57v-1.9l.42.22zm1.76 1v-2.3l4.13 2.22.26.12v2.09a.58.58 0 000 .19zm12.72-1.56a.64.64 0 01-.34.57l-6.25 3.36a.55.55 0 000-.18v-2.1l.26-.12 6.31-3.39zm-7.15 0a.6.6 0 01-.6 0l-4.06-2.17 4.62-2.43a.89.89 0 00.37-1.19.87.87 0 00-.78-.47.83.83 0 00-.41.1l-5.68 3-4.37-2.35L12.2 1.84a.68.68 0 01.6 0l10.31 5.54z" />
    </svg>
  ),
  athletics: (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 25 25">
      <path d="M24.57 9.27a12.4 12.4 0 00-5.82-7.59l-.12-.07a12.63 12.63 0 00-3.3-1.28h-.1c-.35-.08-.72-.14-1.09-.19A12.6 12.6 0 0012.5 0a12.61 12.61 0 00-5.93 1.5 12.63 12.63 0 00-1.61 1A12.67 12.67 0 00.5 8.86a11.78 11.78 0 00-.41 1.93 12.31 12.31 0 00.32 4.87 12.48 12.48 0 002.15 4.37 12.28 12.28 0 003.67 3.21l.12.07A12.21 12.21 0 0012.5 25a12.67 12.67 0 003.18-.41h.13a12.42 12.42 0 004.31-2.13 12.56 12.56 0 003.21-3.67l.44-.75a12.3 12.3 0 001.17-3.84 12.33 12.33 0 00-.37-4.93zm-6.72-6.29l.11.06a11.05 11.05 0 012.81 2.32l-.83.27-3.53-2.44-.24-1a10.17 10.17 0 011.68.79zm-2.23 1.58l3.4 2.35v3.37l-2.91 1.22-3.61-2.25-.13-3.26zM9.67 1.95a11.09 11.09 0 014.25-.28l.52.08.35 1.46-3.29 1.46-3.27-.51-.37-1.54a11.78 11.78 0 011.81-.67zm1.28 7.28L7.63 11 5.78 8.71l2.14-3 2.91.45zM3.04 7.04a11 11 0 012.81-3.21l.56-.4.3 1.26-2.46 3.46-1.94 1.11L2.15 9a11.13 11.13 0 01.89-1.96zm-.75 7.7l.49-3.93L4.6 9.76l2 2.51-.1 4.14-1.9 1.09zm7.87 7H6.93L5.5 18.79l1.75-1 3.25 2.07zM8.05 16.5l.14-4 3.53-1.87 3.5 2.18-.24 3.91-3.63 1.87zm10.23 4.29L15.36 23l-3.63-1 .29-2 3.79-2 2.72.88zm-1.71-4.11l.22-3.73 2.71-1.14 1.42 2.69-1.86 2.94zm5.44 1.23v.1a11.19 11.19 0 01-2.11 2.49l.26-1.89 2.17-3.43.79-.17a11 11 0 01-1.11 2.85zm1.38-4.48l-1.15.25-1.65-3v-3.6l1.16-.38a11.3 11.3 0 011.29 3 11 11 0 01.35 3.68z" />
    </svg>
  ),
  book: (
    <svg viewBox="0 0 14 14" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M2.41165 0.875L2.41176 0.875L12.6471 0.875C12.708 0.874967 12.7686 0.885674 12.8256 0.906766C12.8825 0.92786 12.9351 0.959095 12.98 0.999283C13.025 1.03949 13.0615 1.088 13.0866 1.14244C13.1118 1.19693 13.125 1.25591 13.125 1.31588M2.41165 0.875L13 12.6842M2.41165 0.875C2.00844 0.875356 1.61944 1.01871 1.33055 1.27718C1.04122 1.53606 0.875411 1.89024 0.875 2.26302V2.26316L0.875 11.7368L0.875 11.737C0.875411 12.1098 1.04122 12.4639 1.33055 12.7228C1.61944 12.9813 2.00844 13.1246 2.41165 13.125H2.41176H12.647M2.41165 0.875L13 12.6842M13.125 1.31588L13 1.31579H13.125V1.31588ZM13.125 1.31588V12.6841M13.125 12.6841L13 12.6842M13.125 12.6841V12.6842H13M13.125 12.6841C13.125 12.7441 13.1118 12.8031 13.0866 12.8576C13.0615 12.912 13.025 12.9605 12.98 13.0007C12.9351 13.0409 12.8825 13.0721 12.8256 13.0932L12.7822 12.976L12.8256 13.0932C12.7686 13.1143 12.708 13.125 12.647 13.125M12.647 13.125L12.6471 13V13.125H12.647ZM1.83088 11.7367V2.26326C1.83109 2.1337 1.88859 2.00628 1.99625 1.90996C2.10438 1.81321 2.25367 1.75676 2.41191 1.75658L2.99265 1.75658V12.2434H2.41191C2.25367 12.2432 2.10438 12.1868 1.99625 12.09C1.88859 11.9937 1.83109 11.8663 1.83088 11.7367ZM12.1691 12.2434H3.94853V1.75658H12.1691V12.2434Z"
        strokeWidth="0.25"
      />
      <path
        d="M6.2941 4.28282H9.82352C9.94606 4.28282 10.066 4.23939 10.1564 4.15849C10.2473 4.07717 10.3015 3.96371 10.3015 3.84203C10.3015 3.72036 10.2473 3.6069 10.1564 3.52558C10.066 3.44468 9.94606 3.40125 9.82352 3.40125H6.2941C6.17156 3.40125 6.05161 3.44468 5.96119 3.52558C5.87031 3.6069 5.81616 3.72036 5.81616 3.84203C5.81616 3.96371 5.87031 4.07717 5.96119 4.15849L6.04454 4.06533L5.96119 4.15849C6.05161 4.23939 6.17156 4.28282 6.2941 4.28282Z"
        strokeWidth="0.25"
      />
      <path
        d="M9.82352 5.29602H6.2941C6.17156 5.29602 6.05161 5.33945 5.96119 5.42036C5.87031 5.50167 5.81616 5.61514 5.81616 5.73681C5.81616 5.85848 5.87031 5.97195 5.96119 6.05326L6.04454 5.96011L5.96119 6.05326C6.05161 6.13417 6.17156 6.1776 6.2941 6.1776H9.82352C9.94606 6.1776 10.066 6.13417 10.1564 6.05326C10.2473 5.97195 10.3015 5.85848 10.3015 5.73681C10.3015 5.61514 10.2473 5.50167 10.1564 5.42036C10.066 5.33945 9.94606 5.29602 9.82352 5.29602Z"
        strokeWidth="0.25"
      />
    </svg>
  ),
  calendar: (
    <svg viewBox="0 0 14 14" xmlns="http://www.w3.org/2000/svg">
      <path d="M9.26491 6.53795L9.26504 6.53808L9.27447 6.52839C9.30224 6.49989 9.32095 6.49945 9.33024 6.50016C9.34005 6.5009 9.39254 6.50828 9.46653 6.59364C9.48581 6.62115 9.50184 6.66624 9.49983 6.7199C9.4979 6.77157 9.48009 6.81329 9.45381 6.84254L6.17891 9.95342C6.11224 9.9937 6.06909 10 6.04438 10H6.04409H6.04381H6.04352H6.04323H6.04295H6.04266H6.04238H6.0421H6.04182H6.04154H6.04126H6.04098H6.04071H6.04043H6.04016H6.03988H6.03961H6.03934H6.03907H6.0388H6.03854H6.03827H6.03801H6.03774H6.03748H6.03722H6.03696H6.0367H6.03644H6.03618H6.03592H6.03567H6.03541H6.03516H6.03491H6.03466H6.03441H6.03416H6.03391H6.03366H6.03342H6.03317H6.03293H6.03268H6.03244H6.0322H6.03196H6.03172H6.03148H6.03125H6.03101H6.03078H6.03054H6.03031H6.03008H6.02985H6.02962H6.02939H6.02916H6.02894H6.02871H6.02849H6.02826H6.02804H6.02782H6.0276H6.02738H6.02716H6.02694H6.02672H6.02651H6.02629H6.02608H6.02587H6.02566H6.02544H6.02523H6.02503H6.02482H6.02461H6.0244H6.0242H6.024H6.02379H6.02359H6.02339H6.02319H6.02299H6.02279H6.02259H6.0224H6.0222H6.02201H6.02181H6.02162H6.02143H6.02124H6.02105H6.02086H6.02067H6.02048H6.02029H6.02011H6.01992H6.01974H6.01956H6.01937H6.01919H6.01901H6.01883H6.01866H6.01848H6.0183H6.01813H6.01795H6.01778H6.0176H6.01743H6.01726H6.01709H6.01692H6.01675H6.01658H6.01642H6.01625H6.01608H6.01592H6.01576H6.01559H6.01543H6.01527H6.01511H6.01495H6.01479H6.01464H6.01448H6.01432H6.01417H6.01401H6.01386H6.01371H6.01355H6.0134H6.01325H6.0131H6.01295H6.01281H6.01266H6.01251H6.01237H6.01222H6.01208H6.01194H6.01179H6.01165H6.01151H6.01137H6.01123H6.0111H6.01096H6.01082H6.01068H6.01055H6.01042H6.01028H6.01015H6.01002H6.00989H6.00975H6.00962H6.0095H6.00937H6.00924H6.00911H6.00899H6.00886H6.00874H6.00861H6.00849H6.00837H6.00825H6.00813H6.00801H6.00789H6.00777H6.00765H6.00753H6.00742H6.0073H6.00718H6.00707H6.00696H6.00684H6.00673H6.00662H6.00651H6.0064H6.00629H6.00618H6.00607H6.00596H6.00586H6.00575H6.00565H6.00554H6.00544H6.00533H6.00523H6.00513H6.00503H6.00493H6.00483H6.00473H6.00463H6.00453H6.00444H6.00434H6.00424H6.00415H6.00405H6.00396H6.00387H6.00377H6.00368H6.00359H6.0035H6.00341H6.00332H6.00323H6.00314H6.00305H6.00297H6.00288H6.00279H6.00271H6.00262H6.00254H6.00246H6.00237H6.00229H6.00221H6.00213H6.00205H6.00197H6.00189H6.00181H6.00173H6.00166H6.00158H6.0015H6.00143H6.00135H6.00128H6.0012H6.00113H6.00106H6.00098H6.00091H6.00084H6.00077H6.0007H6.00063H6.00056H6.00049H6.00043H6.00036H6.00029H6.00023H6.00016H6.0001H6.00003H5.99997H5.9999H5.99984H5.99978H5.99972H5.99966H5.99959H5.99953H5.99947H5.99942H5.99936H5.9993H5.99924H5.99918H5.99913H5.99907H5.99901H5.99896H5.9989H5.99885H5.9988H5.99874H5.99869H5.99864H5.99859H5.99853H5.99848H5.99843H5.99838H5.99833H5.99828H5.99824H5.99819H5.99814H5.99809H5.99805H5.998H5.99795H5.99791H5.99786H5.99782H5.99778H5.99773H5.99769H5.99765H5.9976H5.99756H5.99752H5.99748H5.99744H5.9974H5.99736H5.99732H5.99728H5.99724H5.9972H5.99717H5.99713H5.99709H5.99706H5.99702H5.99698H5.99695H5.99691H5.99688H5.99684H5.99681H5.99678H5.99674H5.99671H5.99668H5.99665H5.99662H5.99659H5.99656H5.99653H5.9965H5.99647H5.99644H5.99641H5.99638H5.99635H5.99632H5.9963H5.99627H5.99624H5.99622H5.99619H5.99616H5.99614H5.99611H5.99609H5.99606H5.99604H5.99602H5.99599H5.99597H5.99595H5.99592H5.9959H5.99588H5.99586H5.99584H5.99582H5.9958H5.99578H5.99576H5.99574H5.99572H5.9957H5.99568H5.99566H5.99564H5.99562H5.99561H5.99559H5.99557H5.99555H5.99554H5.99552H5.99551H5.99549H5.99547H5.99546H5.99544H5.99543H5.99541H5.9954H5.99539H5.99537H5.99536H5.99535H5.99533H5.99532H5.99531H5.99529H5.99528H5.99527H5.99526H5.99525H5.99524H5.99523H5.99522H5.9952H5.99519H5.99518H5.99517H5.99516H5.99516H5.99515H5.99514H5.99513H5.99512H5.99511H5.9951H5.99509H5.99509H5.99508H5.99507H5.99506H5.99506H5.99505H5.99504H5.99504H5.99503H5.99502H5.99502H5.99501H5.99501H5.995H5.99499H5.99499H5.99498H5.99498H5.99497H5.99497H5.99496H5.99496H5.99496H5.99495H5.99495H5.99494H5.99494H5.99494H5.99493H5.99493H5.99492H5.99491H5.99491H5.9949H5.9949H5.9949H5.99489H5.99489H5.99488H5.99488H5.99488H5.99487C5.99487 10.183 5.99487 10.366 5.99487 10.5V10C5.97641 10 5.9622 9.99922 5.95156 9.99819L5.95084 9.99708L5.92974 9.97233L4.54797 8.35128C4.50102 8.29196 4.49876 8.2527 4.50033 8.23247C4.50214 8.20926 4.51329 8.16942 4.55482 8.12114C4.57735 8.10436 4.59456 8.09652 4.60538 8.09278C4.6184 8.08828 4.62779 8.0877 4.63558 8.08834C4.64924 8.08946 4.68727 8.0979 4.73872 8.14822L5.71959 9.25578L6.06692 9.64798L6.44249 9.28274L9.26491 6.53795Z" />
      <path
        d="M12.5514 1.9558H10.371V1.50835C10.371 1.18368 10.1062 0.9 9.78505 0.9C9.46394 0.9 9.19906 1.18368 9.19906 1.50835V1.9558H4.83832V1.50835C4.83832 1.18368 4.57344 0.9 4.25234 0.9C3.93123 0.9 3.66635 1.18368 3.66635 1.50835V1.9558H1.48598C1.16488 1.9558 0.9 2.23949 0.9 2.56415V12.4917C0.9 12.8163 1.16488 13.1 1.48598 13.1H12.514C12.8351 13.1 13.1 12.8163 13.1 12.4917V2.56415C13.1 2.40006 13.033 2.24959 12.9339 2.1402C12.8356 2.03163 12.6982 1.9558 12.5514 1.9558ZM11.9654 3.1334V3.911H2.07196V3.1334H11.9654ZM2.07196 11.8833V5.08859H11.9654V11.8833H2.07196Z"
        strokeWidth="0.2"
      />
    </svg>
  ),
  lightning: (
    <svg viewBox="0 0 14 14" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M12.5725 5.50178L12.5561 5.49722H12.5391H12.51C12.4395 5.48239 12.3861 5.4824 12.3099 5.48241H12.3045H12.3043H12.3042H12.3041H12.304H12.3038H12.3037H12.3036H12.3035H12.3033H12.3032H12.3031H12.303H12.3028H12.3027H12.3026H12.3025H12.3023H12.3022H12.3021H12.302H12.3018H12.3017H12.3016H12.3015H12.3013H12.3012H12.3011H12.301H12.3008H12.3007H12.3006H12.3005H12.3003H12.3002H12.3001H12.3H12.2998H12.2997H12.2996H12.2995H12.2993H12.2992H12.2991H12.299H12.2988H12.2987H12.2986H12.2984H12.2983H12.2982H12.2981H12.2979H12.2978H12.2977H12.2976H12.2974H12.2973H12.2972H12.2971H12.2969H12.2968H12.2967H12.2966H12.2964H12.2963H12.2962H12.296H12.2959H12.2958H12.2957H12.2955H12.2954H12.2953H12.2952H12.295H12.2949H12.2948H12.2946H12.2945H12.2944H12.2943H12.2941H12.294H12.2939H12.2937H12.2936H12.2935H12.2934H12.2932H12.2931H12.293H12.2928H12.2927H12.2926H12.2925H12.2923H12.2922H12.2921H12.2919H12.2918H12.2917H12.2915H12.2914H12.2913H12.2912H12.291H12.2909H12.2908H12.2906H12.2905H12.2904H12.2902H12.2901H12.29H12.2898H12.2897H12.2896H12.2895H12.2893H12.2892H12.2891H12.2889H12.2888H12.2887H12.2885H12.2884H12.2883H12.2881H12.288H12.2879H12.2877H12.2876H12.2875H12.2873H12.2872H12.2871H12.2869H12.2868H12.2867H12.2865H12.2864H12.2863H12.2861H12.286H12.2859H12.2857H12.2856H12.2855H12.2853H12.2852H12.285H12.2849H12.2848H12.2846H12.2845H12.2844H12.2842H12.2841H12.284H12.2838H12.2837H12.2835H12.2834H12.2833H12.2831H12.283H12.2829H12.2827H12.2826H12.2824H12.2823H12.2822H12.282H12.2819H12.2817H12.2816H12.2815H12.2813H12.2812H12.281H12.2809H12.2808H12.2806H12.2805H12.2803H12.2802H12.2801H12.2799H12.2798H12.2796H12.2795H12.2793H12.2792H12.2791H12.2789H12.2788H12.2786H12.2785H12.2783H12.2782H12.2781H12.2779H12.2778H12.2776H12.2775H12.2773H12.2772H12.277H12.2769H12.2767H12.2766H12.2765H12.2763H12.2762H12.276H12.2759H12.2757H12.2756H12.2754H12.2753H12.2751H12.275H12.2748H12.2747H12.2745H12.2744H12.2742H12.2741H12.2739H12.2738H12.2736H12.2735H12.2733H12.2732H12.273H12.2729H12.2727H12.2726H12.2724H12.2723H12.2721H12.272H12.2718H12.2717H12.2715H12.2714H12.2712H12.271H12.2709H12.2707H12.2706H12.2704H12.2703H12.2701H12.27H12.2698H12.2696H12.2695H12.2693H12.2692H12.269H12.2689H12.2687H12.2685H12.2684H12.2682H12.2681H12.2679H12.2678H12.2676H12.2674H12.2673H12.2671H12.267H12.2668H12.2666H12.2665H12.2663H12.2661H12.266H12.2658H12.2657H12.2655H12.2653H12.2652H12.265H12.2648H12.2647H12.2645H12.2643H12.2642H12.264H12.2638H12.2637H12.2635H12.2633H12.2632H12.263H12.2628H12.2627H12.2625H12.2623H12.2622H12.262H12.2618H12.2617H12.2615H12.2613H12.2612H12.261H12.2608H12.2606H12.2605H12.2603H12.2601H12.26H12.2598H12.2596H12.2594H12.2593H12.2591H12.2589H12.2587H12.2586H12.2584H12.2582H12.258H12.2579H12.2577H12.2575H12.2573H12.2572H12.257H12.2568H12.2566H12.2564H12.2563H12.2561H12.2559H12.2557H12.2555H12.2554H12.2552H12.255H12.2548H12.2546H12.2545H12.2543H12.2541H12.2539H12.2537H12.2535H12.2534H12.2532H12.253H12.2528H12.2526H12.2524H12.2522H12.2521H12.2519H12.2517H12.2515H12.2513H12.2511H12.2509H12.2507H12.2506H12.2504H12.2502H12.25H12.2498H12.2496H12.2494H12.2492H12.249H12.2488H12.2486H12.2484H12.2483H12.2481H12.2479H12.2477H12.2475H12.2473H12.2471H12.2469H12.2467H12.2465H12.2463H12.2461H12.2459H12.2457H12.2455H12.2453H12.2451H12.2449H12.2447H12.2445H12.2443H12.2441H12.2439H12.2437H12.2435H12.2433H12.2431H12.2429H12.2427H12.2425H12.2423H12.2421H12.2419H12.2417H12.2414H12.2412H12.241H12.2408H12.2406H12.2404H12.2402H12.24H12.2398H12.2396H12.2394H12.2392H12.2389H12.2387H12.2385H12.2383H12.2381H12.2379H12.2377H12.2374H12.2372H12.237H12.2368H12.2366H12.2364H12.2362H12.2359H12.2357H12.2355H12.2353H12.2351H12.2348H12.2346H12.2344H12.2342H12.234H12.2337H12.2335H12.2333H12.2331H12.2329H12.2326H12.2324H12.2322H12.232H12.2317H12.2315H12.2313H12.2311H12.2308H12.2306H12.2304H12.2301H12.2299H12.2297H12.2295H12.2292H12.229H12.2288H12.2285H12.2283H12.2281H12.2278H12.2276H12.2274H12.2271H12.2269H12.2267H12.2264H12.2262H12.226H12.2257H12.2255H12.2252H12.225H12.2248H12.2245H12.2243H12.2241H12.2238H12.2236H12.2233H12.2231H12.2228H12.2226H12.2224H12.2221H12.2219H12.2216H12.2214H12.2211H12.2209H12.2206H12.2204H12.2201H12.2199H12.2196H12.2194H12.2191H8.70147L10.4083 1.69989L10.4223 1.68044L10.428 1.67262L10.4323 1.66403C10.5043 1.52244 10.5354 1.37601 10.483 1.23873C10.431 1.10267 10.3098 1.00976 10.1567 0.944319L10.1567 0.944314L10.1557 0.943878C10.0301 0.891523 9.9062 0.875 9.78766 0.875C9.49777 0.875 9.32188 1.00408 9.23194 1.07007C9.22167 1.07761 9.21253 1.08432 9.20446 1.08993L9.18684 1.10216L9.17431 1.11957L9.16396 1.13394C7.99603 2.01893 6.82764 2.90432 5.65918 3.80445C5.65909 3.80453 5.65899 3.8046 5.65889 3.80468L3.63327 5.34494L3.63293 5.3452C3.34848 5.56305 3.06104 5.78125 2.77258 6.00024C2.22017 6.41961 1.66398 6.84184 1.11767 7.26991C0.934286 7.39933 0.815698 7.66233 0.905142 7.89013L0.904459 7.8904L0.910753 7.90242C0.972304 8.01999 1.08206 8.09071 1.18158 8.1347C1.27888 8.17771 1.38176 8.20185 1.45781 8.21719L1.49238 8.22919L1.49214 8.22987L1.50519 8.23289C1.58316 8.25094 1.63851 8.25094 1.71995 8.25093H1.72535H1.72547H1.7256H1.72572H1.72585H1.72597H1.7261H1.72622H1.72635H1.72647H1.7266H1.72672H1.72685H1.72697H1.7271H1.72722H1.72735H1.72747H1.7276H1.72772H1.72785H1.72797H1.7281H1.72823H1.72835H1.72848H1.7286H1.72873H1.72885H1.72898H1.7291H1.72923H1.72936H1.72948H1.72961H1.72973H1.72986H1.72999H1.73011H1.73024H1.73037H1.73049H1.73062H1.73075H1.73087H1.731H1.73113H1.73125H1.73138H1.73151H1.73164H1.73176H1.73189H1.73202H1.73215H1.73227H1.7324H1.73253H1.73266H1.73279H1.73291H1.73304H1.73317H1.7333H1.73343H1.73356H1.73369H1.73382H1.73395H1.73407H1.7342H1.73433H1.73446H1.73459H1.73472H1.73485H1.73498H1.73512H1.73525H1.73538H1.73551H1.73564H1.73577H1.7359H1.73603H1.73617H1.7363H1.73643H1.73656H1.73669H1.73683H1.73696H1.73709H1.73723H1.73736H1.73749H1.73763H1.73776H1.73789H1.73803H1.73816H1.7383H1.73843H1.73857H1.7387H1.73884H1.73897H1.73911H1.73924H1.73938H1.73952H1.73965H1.73979H1.73993H1.74006H1.7402H1.74034H1.74048H1.74062H1.74075H1.74089H1.74103H1.74117H1.74131H1.74145H1.74159H1.74173H1.74187H1.74201H1.74215H1.74229H1.74243H1.74257H1.74272H1.74286H1.743H1.74314H1.74329H1.74343H1.74357H1.74372H1.74386H1.744H1.74415H1.74429H1.74444H1.74458H1.74473H1.74487H1.74502H1.74517H1.74531H1.74546H1.74561H1.74575H1.7459H1.74605H1.7462H1.74635H1.7465H1.74664H1.74679H1.74694H1.74709H1.74724H1.7474H1.74755H1.7477H1.74785H1.748H1.74815H1.74831H1.74846H1.74861H1.74877H1.74892H1.74908H1.74923H1.74938H1.74954H1.7497H1.74985H1.75001H1.75017H1.75032H1.75048H1.75064H1.7508H1.75095H1.75111H1.75127H1.75143H1.75159H1.75175H1.75191H1.75207H1.75224H1.7524H1.75256H1.75272H1.75288H1.75305H1.75321H1.75338H1.75354H1.7537H1.75387H1.75404H1.7542H1.75437H1.75453H1.7547H1.75487H1.75504H1.75521H1.75538H1.75554H1.75571H1.75588H1.75605H1.75623H1.7564H1.75657H1.75674H1.75691H1.75709H1.75726H1.75743H1.75761H1.75778H1.75796H1.75813H1.75831H1.75849H1.75866H1.75884H1.75902H1.7592H1.75938H1.75955H1.75973H1.75991H1.7601H1.76028H1.76046H1.76064H1.76082H1.761H1.76119H1.76137H1.76156H1.76174H1.76193H1.76211H1.7623H1.76249H1.76267H1.76286H1.76305H1.76324H1.76343H1.76362H1.76381H1.764H1.76419H1.76438H1.76457H1.76476H1.76496H1.76515H1.76535H1.76554H1.76574H1.76593H1.76613H1.76632H1.76652H1.76672H1.76692H1.76712H1.76732H1.76752H1.76772H1.76792H1.76812H1.76832H1.76852H1.76873H1.76893H1.76914H1.76934H1.76955H1.76975H1.76996H1.77017H1.77037H1.77058H1.77079H1.771H1.77121H1.77142H1.77163H1.77184H1.77206H1.77227H1.77248H1.7727H1.77291H1.77313H1.77334H1.77356H1.77377H1.77399H1.77421H1.77443H1.77465H1.77487H1.77509H1.77531H1.77553H1.77575H1.77598H1.7762H1.77642H1.77665H1.77687H1.7771H1.77733H1.77755H1.77778H1.77801H1.77824H1.77847H1.7787H1.77893H1.77916H1.77939H1.77963H1.77986H1.7801H1.78033H1.78057H1.7808H1.78104H1.78128H1.78151H1.78175H1.78199H1.78223H1.78247H1.78271H1.78296H1.7832H1.78344H1.78369H1.78393H1.78418H1.78442H1.78467H1.78492H1.78517H1.78541H1.78566H1.78591H1.78617H1.78642H1.78667H1.78692H1.78718H1.78743H1.78769H1.78794H1.7882H1.78846H1.78871H1.78897H1.78923H1.78949H1.78975H1.79001H1.79028H1.79054H1.7908H1.79107H1.79133H1.7916H1.79187H1.79213H1.7924H1.79267H1.79294H1.79321H1.79348H1.79375H1.79403H1.7943H1.79457H1.79485H1.79512H1.7954H1.79568H1.79596H1.79623H1.79651H1.79679H1.79707H1.79736H1.79764H1.79792H1.79821H1.79849H1.79878H1.79906H1.79935H1.79964H1.79993H1.80022H1.80051H1.8008H1.80109H1.80138H1.80168H1.80197H1.80227H1.80256H1.80286H1.80316H1.80345H1.80375H1.80405H1.80436H1.80466H1.80496H1.80526H1.80557H1.80587H1.80618H1.80648H1.80679H1.8071H1.80741H1.80772H1.80803H1.80834H1.80865H1.80897H1.80928H1.8096H1.80991H1.81023H1.81055H1.81087H1.81118H1.81151H1.81183H1.81215H1.81247H1.81279H1.81312H1.81344H1.81377H1.8141H1.81443H1.81476H1.81508H1.81542H1.81575H1.81608H1.81641H1.81675H1.81708H1.81742H1.81776H1.81809H1.81843H1.81877H1.81911H1.81945H1.8198H1.82014H1.82048H1.82083H1.82117H1.82152H1.82187H1.82222H1.82257H1.82292H1.82327H1.82362H1.82398H1.82433H1.82469H1.82504H1.8254H1.82576H1.82612H1.82648H1.82684H1.8272H1.82756H1.82793H1.82829H1.82866H1.82902H1.82939H1.82976H1.83013H1.8305H1.83087H1.83124H1.83162H1.83199H5.04349L3.74154 11.7552C3.74146 11.7554 3.74138 11.7556 3.74129 11.7558C3.6839 11.9054 3.62606 12.0694 3.5689 12.2315C3.54061 12.3117 3.51249 12.3915 3.48467 12.4688L3.4842 12.4686L3.48136 12.4795C3.44764 12.6083 3.49247 12.7346 3.55784 12.8299C3.62409 12.9266 3.72233 13.0088 3.82979 13.0554L3.82964 13.0557L3.83855 13.0588L3.84333 13.0605C3.92674 13.0895 4.029 13.125 4.15684 13.125C4.25104 13.125 4.36799 13.1095 4.46694 13.0764C4.63175 13.0415 4.71876 12.9583 4.77733 12.9023C4.78275 12.8971 4.78793 12.8921 4.79291 12.8875L11.9765 7.20192L11.9768 7.20172L11.9775 7.20118C12.2968 6.94983 12.6181 6.6969 12.9183 6.4437L12.9187 6.44423L12.9279 6.43471C13.0675 6.28921 13.2003 6.03787 13.0764 5.80128C13.014 5.68217 12.9025 5.6154 12.8093 5.57573C12.7343 5.54377 12.6547 5.52319 12.6035 5.50995C12.5915 5.50684 12.581 5.50414 12.5725 5.50178ZM8.37995 6.28056H11.6504C11.6258 6.3 11.6012 6.31944 11.5765 6.33892L11.5761 6.33926C11.4593 6.43139 11.3415 6.52437 11.2236 6.62116L4.81779 11.6882L6.08702 8.2582L6.08703 8.2582L6.0874 8.25715C6.13771 8.11739 6.14112 7.99306 6.1079 7.88537C6.07543 7.78014 6.01157 7.70234 5.94568 7.64682C5.78832 7.50258 5.5435 7.42419 5.27316 7.40854L5.27317 7.40833H5.26594H2.35522C3.02292 6.90546 3.68954 6.40036 4.34018 5.8839L6.36539 4.34395L6.36589 4.34356C7.23879 3.67275 8.12792 3.00191 9.00548 2.34052L7.58337 5.51182L7.57243 5.53622V5.56296V5.56297V5.56297V5.56298V5.56298V5.56299V5.56299V5.563V5.563V5.56301V5.56301V5.56302V5.56302V5.56303V5.56304V5.56304V5.56305V5.56306V5.56307V5.56308V5.56308V5.56309V5.5631V5.56311V5.56312V5.56313V5.56314V5.56315V5.56317V5.56318V5.56319V5.5632V5.56321V5.56323V5.56324V5.56325V5.56327V5.56328V5.5633V5.56331V5.56333V5.56334V5.56336V5.56337V5.56339V5.56341V5.56342V5.56344V5.56346V5.56348V5.56349V5.56351V5.56353V5.56355V5.56357V5.56359V5.56361V5.56363V5.56365V5.56367V5.56369V5.56371V5.56373V5.56376V5.56378V5.5638V5.56382V5.56385V5.56387V5.56389V5.56392V5.56394V5.56397V5.56399V5.56402V5.56404V5.56407V5.56409V5.56412V5.56415V5.56417V5.5642V5.56423V5.56426V5.56428V5.56431V5.56434V5.56437V5.5644V5.56443V5.56446V5.56449V5.56452V5.56455V5.56458V5.56461V5.56464V5.56467V5.5647V5.56474V5.56477V5.5648V5.56483V5.56487V5.5649V5.56493V5.56497V5.565V5.56504V5.56507V5.56511V5.56514V5.56518V5.56521V5.56525V5.56529V5.56532V5.56536V5.5654V5.56543V5.56547V5.56551V5.56555V5.56559V5.56562V5.56566V5.5657V5.56574V5.56578V5.56582V5.56586V5.5659V5.56594V5.56598V5.56602V5.56607V5.56611V5.56615V5.56619V5.56623V5.56628V5.56632V5.56636V5.56641V5.56645V5.56649V5.56654V5.56658V5.56663V5.56667V5.56671V5.56676V5.56681V5.56685V5.5669V5.56694V5.56699V5.56704V5.56708V5.56713V5.56718V5.56722V5.56727V5.56732V5.56737V5.56742V5.56747V5.56751V5.56756V5.56761V5.56766V5.56771V5.56776V5.56781V5.56786V5.56791V5.56796V5.56802V5.56807V5.56812V5.56817V5.56822V5.56827V5.56833V5.56838V5.56843V5.56848V5.56854V5.56859V5.56865V5.5687V5.56875V5.56881V5.56886V5.56892V5.56897V5.56903V5.56908V5.56914V5.56919V5.56925V5.5693V5.56936V5.56942V5.56947V5.56953V5.56959V5.56965V5.5697V5.56976V5.56982V5.56988V5.56993V5.56999V5.57005V5.57011V5.57017V5.57023V5.57029V5.57035V5.57041V5.57047V5.57053V5.57059V5.57065V5.57071V5.57077V5.57083V5.57089V5.57095V5.57102V5.57108V5.57114V5.5712V5.57127V5.57133V5.57139V5.57145V5.57152V5.57158V5.57164V5.57171V5.57177V5.57183V5.5719V5.57196V5.57203V5.57209V5.57216V5.57222V5.57229V5.57235V5.57242V5.57248V5.57255V5.57262V5.57268V5.57275V5.57281V5.57288V5.57295V5.57302V5.57308V5.57315V5.57322V5.57329V5.57335V5.57342V5.57349V5.57356V5.57363V5.57369V5.57376V5.57383V5.5739V5.57397V5.57404V5.57411V5.57418V5.57425V5.57432V5.57439V5.57446V5.57453V5.5746V5.57467V5.57474V5.57481V5.57488V5.57495V5.57503V5.5751V5.57517V5.57524V5.57531V5.57539V5.57546V5.57553V5.5756V5.57568V5.57575V5.57582V5.57589V5.57597V5.57604C7.52417 5.76656 7.58581 5.9369 7.71115 6.0762L7.71631 6.08193L7.72212 6.08698C7.8343 6.18438 8.03586 6.28056 8.37995 6.28056Z"
        strokeWidth="0.25"
      />
    </svg>
  ),
  school: (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 25 23">
      <path
        d="M524 504.36a.62.62 0 00-.1-.34.59.59 0 00-.12-.21.78.78 0 00-.24-.15.62.62 0 00-.34-.1h-6.51l-.89-.84-.52-.5-2.59-2.45-.37-.34v-.37l.7-.29 1.21-.5.17-.07.18-.08a.8.8 0 00.52-.74.83.83 0 00-.52-.76l-1.22-.51-1.22-.51-.17-.07-.18-.07a.63.63 0 00-.27-.06.82.82 0 00-.8.81v3.25l-.7.66-2.08 2-.79.75-.75.71h-6.58a.58.58 0 00-.32.09.55.55 0 00-.23.13.65.65 0 00-.15.22.7.7 0 00-.1.36V517.63a.8.8 0 00.8.81h23.38a.8.8 0 00.8-.8V506v-.53-1.11zM505.93 516v.84h-5.31v-11.68h5.32zm6.68.84h-2.11v-4.13h2.11zm2.92 0h-1.32v-4.93a.8.8 0 00-.8-.8h-3.71a.8.8 0 00-.8.8v4.93h-1.37v-12.16l1.38-1.3c.86-.82 1.72-1.64 2.59-2.45l.24.22.83.79 2.58 2.45.34.32zm6.86 0h-5.26v-11.35-.33h5.25z"
        transform="translate(-499 -495.4)"
      />
      <path
        d="M512.28 504.7a1.9 1.9 0 00-.71-.13 2.16 2.16 0 100 4.32 2.58 2.58 0 00.4 0 2.15 2.15 0 001.73-1.94v-.17a2.17 2.17 0 00-1.42-2.08zm-1.2 1.75a.57.57 0 01.48-.28h.1a.57.57 0 01.46.55.58.58 0 01-.36.52.65.65 0 01-.2 0 .58.58 0 01-.44-.21.56.56 0 01-.04-.58zM504.11 506.7v3a.8.8 0 01-1.6 0v-3a.8.8 0 011.6 0zM504.11 512.27v3a.8.8 0 01-1.6 0v-3a.8.8 0 011.6 0zM520.58 506.7v3a.8.8 0 01-1.6 0v-3a.8.8 0 011.6 0zM520.58 512.27v3a.8.8 0 01-1.6 0v-3a.8.8 0 011.6 0z"
        transform="translate(-499 -495.4)"
      />
    </svg>
  ),
  shoe: (
    <svg viewBox="0 0 13 13" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M3.57586 8.85647L3.57578 8.85638C2.28549 7.47625 1.4318 6.55337 1.19657 6.27231L1.19618 6.27184C0.47984 5.40166 0.356758 4.21734 0.989647 3.44265C1.2804 3.07711 1.88644 2.40578 2.38239 1.91604C2.63232 1.66224 2.90947 1.42306 3.19973 1.19844C3.32283 1.10124 3.46294 1.01424 3.61965 0.967316C3.62398 0.963693 3.63009 0.959146 3.63782 0.955222C3.64973 0.949175 3.6609 0.946854 3.66978 0.945952C3.67163 0.945764 3.67349 0.945634 3.67525 0.945544C4.02678 0.857431 4.39371 1.06013 4.48621 1.42023L4.48709 1.42365L4.487 1.42366L4.48737 1.42541C4.54203 1.68914 4.59761 1.95725 4.6255 2.23998M3.57586 8.85647L4.55093 2.24806M3.57586 8.85647L6.06223 11.5072L6.06222 11.5072L6.06349 11.5085C6.4075 11.8579 6.86517 12.046 7.34878 12.0749L7.34877 12.075H7.35325H10.4578C11.5582 12.075 12.4143 10.8183 11.9422 9.6838M3.57586 8.85647L11.9422 9.6838M4.6255 2.23998C4.62552 2.24022 4.62555 2.24047 4.62557 2.24071L4.55093 2.24806M4.6255 2.23998C4.62547 2.23974 4.62544 2.2395 4.62542 2.23926L4.55093 2.24806M4.6255 2.23998C4.66686 2.58984 4.70719 2.79965 4.78249 2.94623C4.85438 3.08618 4.96159 3.17437 5.15936 3.26818M4.55093 2.24806C4.63335 2.94563 4.71578 3.14094 5.12788 3.33626M5.15936 3.26818C5.15915 3.26809 5.15895 3.268 5.15874 3.2679L5.12788 3.33626M5.15936 3.26818C5.26762 3.31689 5.38604 3.32848 5.50439 3.29242L5.50879 3.29108L5.50882 3.29122C5.7392 3.23616 5.95194 3.16827 6.1499 3.06104L6.15354 3.05907L6.15359 3.05918L6.18168 3.0459C6.4577 2.91551 6.60865 2.8442 6.71774 2.80092C6.83335 2.75506 6.90393 2.73991 7.02121 2.71885M5.15936 3.26818C5.15958 3.26829 5.15979 3.26839 5.16 3.26849L5.12788 3.33626M5.12788 3.33626L7.02121 2.71885M7.02121 2.71885C7.02024 2.7191 7.01926 2.71936 7.01829 2.71961L7.0373 2.79216M7.02121 2.71885L5.52625 3.36416C5.75978 3.30836 5.97957 3.2386 6.18562 3.12699L6.21013 3.11542C6.77712 2.84757 6.80705 2.83343 7.0373 2.79216M7.02121 2.71885C7.48149 2.5997 7.95676 2.8265 8.14992 3.26412L8.15013 3.26459C8.22578 3.43923 8.65176 4.43706 9.06035 5.39428L9.61454 6.69238L9.79583 7.11651L9.84743 7.23686C9.85256 7.24879 9.85653 7.25801 9.85945 7.26475C9.86389 7.27504 9.86587 7.27958 9.8657 7.27925C9.90218 7.35335 9.95094 7.41617 10.0053 7.48518C10.0067 7.4865 10.0087 7.48846 10.0116 7.49119L10.0366 7.51484L10.1238 7.597C10.1959 7.66503 10.293 7.75663 10.3961 7.85436C10.6018 8.04935 10.8329 8.27009 10.9371 8.37585L10.9384 8.37724C11.0469 8.48735 11.1444 8.5864 11.2284 8.68588C11.5851 9.07609 11.8268 9.39129 11.9422 9.6838M7.02121 2.71885C7.02216 2.71868 7.02312 2.71851 7.02407 2.71834L7.0373 2.79216M7.0373 2.79216C7.46315 2.68055 7.90273 2.88982 8.08131 3.29441M8.08131 3.29441C8.16061 3.47745 8.62582 4.56733 9.05203 5.56583C9.43795 6.46993 9.79189 7.29911 9.79841 7.31237C9.83962 7.39608 9.89457 7.46583 9.94952 7.53559C9.95234 7.53846 9.98466 7.56894 10.036 7.61738C10.235 7.80501 10.7199 8.26215 10.8836 8.42847C10.9935 8.54008 11.0897 8.63774 11.1721 8.7354C11.5293 9.12604 11.7628 9.43297 11.8727 9.71199M8.08131 3.29441L7.35325 12H10.4578C11.5018 12 12.326 10.8002 11.8727 9.71199M8.08131 3.29441L11.9422 9.6838M11.8727 9.71199L11.9425 9.68451C11.9424 9.68427 11.9423 9.68404 11.9422 9.6838M11.8727 9.71199L11.9419 9.68315C11.942 9.68337 11.9421 9.68358 11.9422 9.6838M1.90191 4.20797L1.90192 4.20798L1.90275 4.20696C2.17585 3.87413 2.75102 3.23432 3.21616 2.77582L3.21617 2.77582L3.21695 2.77503C3.306 2.68459 3.39504 2.60151 3.4895 2.52032C3.54544 2.97192 3.6324 3.32569 3.79726 3.61414C3.9802 3.93422 4.25467 4.16653 4.66948 4.36646L4.66947 4.36647L4.67039 4.36689C5.01421 4.52694 5.38858 4.57137 5.7496 4.48349C6.05566 4.41282 6.36386 4.31343 6.64542 4.17045L6.64544 4.17048L6.64745 4.16938C6.80028 4.08581 6.96418 4.023 7.13379 3.96107L7.46063 4.7198L5.82655 5.41575L5.82645 5.4158C5.52718 5.54377 5.3851 5.89591 5.52696 6.20007C5.66544 6.49696 5.99565 6.64689 6.29934 6.50161L7.9459 5.7792L8.06552 6.05956L6.59571 6.69931C6.59564 6.69935 6.59557 6.69938 6.59549 6.69941C6.29638 6.82746 6.1544 7.1795 6.29623 7.48359C6.43469 7.78045 6.76484 7.93037 7.06851 7.78517L8.53597 7.14645L8.69894 7.5366L8.69891 7.53661L8.69987 7.53872L8.78169 7.71873C8.78179 7.71896 8.78189 7.71919 8.78199 7.71942C8.88252 7.95251 9.03975 8.16989 9.22511 8.34368L9.22581 8.34432L9.49956 8.59452C9.49972 8.59467 9.49989 8.59483 9.50005 8.59499C9.70736 8.79153 10.2801 9.35968 10.3593 9.45344L10.3591 9.45358L10.3631 9.45768C10.5491 9.64654 10.7092 9.86272 10.8432 10.0932C10.9066 10.2625 10.877 10.4455 10.7932 10.5878C10.7076 10.7332 10.5743 10.8228 10.444 10.8228H7.35875C7.18265 10.7965 7.03441 10.7329 6.89753 10.6071L4.42717 8.0285C4.42706 8.02839 4.42696 8.02827 4.42685 8.02816C3.16564 6.67765 2.31572 5.74488 2.09481 5.49264C1.91059 5.25825 1.80376 5.00268 1.77317 4.7721C1.7424 4.54019 1.78918 4.34054 1.90191 4.20797Z"
        strokeWidth="0.15"
      />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M0 11.0833C0 10.7036 0.29305 10.3958 0.654545 10.3958H3.70909C4.07059 10.3958 4.36364 10.7036 4.36364 11.0833C4.36364 11.463 4.07059 11.7708 3.70909 11.7708H0.654545C0.29305 11.7708 0 11.463 0 11.0833Z"
      />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M0 8.33331C0 7.95362 0.29305 7.64581 0.654545 7.64581H1.52727C1.88877 7.64581 2.18182 7.95362 2.18182 8.33331C2.18182 8.71301 1.88877 9.02081 1.52727 9.02081H0.654545C0.29305 9.02081 0 8.71301 0 8.33331Z"
      />
    </svg>
  ),
  star: (
    <svg viewBox="0 0 14 13" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M3.18408 12.4571L3.1853 12.458C3.33725 12.572 3.51017 12.6296 3.70012 12.6296C3.82296 12.6296 3.96482 12.6127 4.09175 12.5295L7.00734 10.8407L9.90851 12.4985C10.1963 12.6706 10.5427 12.6506 10.8099 12.4597C11.0814 12.2658 11.1956 11.9364 11.1196 11.6129C11.1196 11.6128 11.1196 11.6127 11.1196 11.6126L10.3708 8.36289L12.8388 6.19747C13.089 5.98519 13.1837 5.65684 13.0888 5.33449C12.9943 5.0131 12.7261 4.77713 12.3923 4.75643L9.07991 4.43793L7.77448 1.39723C7.66006 1.09506 7.40856 0.899895 7.08264 0.879542C6.73515 0.842351 6.41149 1.03583 6.25982 1.33918L6.25963 1.33909L6.25679 1.3457L4.93397 4.42164L1.62135 4.74016C1.3076 4.76069 1.04085 4.97571 0.927863 5.277C0.813213 5.58273 0.888676 5.94415 1.11941 6.17489L1.11925 6.17505L1.12494 6.18009L3.62701 8.3953L2.89404 11.6299L2.89396 11.6299L2.89309 11.6345C2.83716 11.9328 2.92858 12.2606 3.18408 12.4571ZM4.7994 8.0852L4.81582 8.01282L4.76013 7.96376L2.24043 5.74402L5.58515 5.42905L5.65887 5.42211L5.6882 5.35411L7.00692 2.29709L8.32563 5.35411L8.35493 5.42204L8.42858 5.42904L11.7396 5.74366L9.23777 7.93086L9.18137 7.98017L9.19827 8.05316L9.94816 11.2927L7.06906 9.64321L7.00635 9.60729L6.94393 9.6437L4.06486 11.3232L4.7994 8.0852Z"
        strokeWidth="0.25"
      />
    </svg>
  ),
  note: (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 29.25 18.25">
      <path
        d="M16.72.5H2.27A1.77 1.77 0 00.5 2.26v10.26a.49.49 0 000 .12.88.88 0 00.26.74l4.85 4.86a.93.93 0 00.64.26h10.47a1.77 1.77 0 001.78-1.76V2.26A1.77 1.77 0 0016.72.5zM5.6 15.66l-2.22-2.22H5.6zm11 1H7.45v-3.3a1.77 1.77 0 00-1.78-1.76H2.35V2.34h14.3zM29 3.25h-2.25V1a.75.75 0 00-1.5 0v2.25H23a.75.75 0 000 1.5h2.25V7a.75.75 0 001.5 0V4.75H29a.75.75 0 000-1.5z"
        transform="translate(-.5 -.25)"
      />
    </svg>
  ),
  plus: (
    <svg viewBox="0 0 14 14" xmlns="http://www.w3.org/2000/svg">
      <path d="M1 7H13" strokeWidth="1.75" strokeLinecap="round" />
      <path d="M7 1L7 13" strokeWidth="1.75" strokeLinecap="round" />
    </svg>
  ),
  profile: (
    <svg viewBox="0 0 14 14" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M11.331 2.66897C10.1824 1.52031 8.62445 0.875 7 0.875H6.875V0.876275C5.70727 0.900103 4.56971 1.25739 3.59713 1.90725C2.58988 2.58027 1.80483 3.53687 1.34124 4.65606C0.877654 5.77526 0.756358 7.00679 0.992693 8.19493C1.22903 9.38306 1.81238 10.4744 2.66897 11.331C3.52557 12.1876 4.61694 12.771 5.80507 13.0073C6.99321 13.2436 8.22474 13.1223 9.34394 12.6588C10.4631 12.1952 11.4197 11.4101 12.0928 10.4029C12.7658 9.39562 13.125 8.21141 13.125 7C13.125 5.37555 12.4797 3.81763 11.331 2.66897ZM7 1.7925C8.38112 1.7925 9.70567 2.34115 10.6823 3.31774C11.6589 4.29434 12.2075 5.61889 12.2075 7C12.2075 8.38111 11.6589 9.70566 10.6823 10.6823C9.70567 11.6589 8.38112 12.2075 7 12.2075C5.61889 12.2075 4.29434 11.6589 3.31774 10.6823C2.34115 9.70566 1.7925 8.38111 1.7925 7C1.7925 5.61889 2.34115 4.29434 3.31774 3.31774C4.29434 2.34115 5.61889 1.7925 7 1.7925Z"
        strokeWidth="0.25"
      />
      <path
        d="M7.00008 7.9025H7.00018C7.66668 7.90198 8.30573 7.63698 8.77702 7.16569C9.24831 6.6944 9.51331 6.05535 9.51383 5.38885V5.38875C9.51383 4.89158 9.3664 4.40557 9.09019 3.99219C8.81397 3.5788 8.42138 3.25661 7.96205 3.06635C7.50272 2.87609 6.99729 2.82631 6.50967 2.9233C6.02205 3.0203 5.57414 3.25971 5.22259 3.61126C4.87104 3.96282 4.63162 4.41072 4.53463 4.89834C4.43764 5.38596 4.48742 5.89139 4.67768 6.35072C4.86794 6.81005 5.19013 7.20264 5.60352 7.47886C6.0169 7.75507 6.50291 7.9025 7.00008 7.9025ZM6.11221 4.06933C6.37502 3.89373 6.684 3.8 7.00008 3.8V3.675L6.99995 3.8C7.42369 3.80046 7.82995 3.969 8.12958 4.26863C8.42921 4.56826 8.59775 4.97452 8.59821 5.39826C8.59818 5.71429 8.50445 6.02322 8.32887 6.28599C8.15327 6.5488 7.90368 6.75364 7.61166 6.8746C7.31964 6.99556 6.99831 7.0272 6.6883 6.96554C6.3783 6.90388 6.09354 6.75167 5.87003 6.52817C5.64653 6.30467 5.49433 6.01991 5.43266 5.7099C5.371 5.3999 5.40265 5.07857 5.5236 4.78655C5.64456 4.49453 5.8494 4.24494 6.11221 4.06933Z"
        strokeWidth="0.25"
      />
      <path
        d="M10.242 10.9463C10.3295 10.9463 10.4152 10.9214 10.4889 10.8743C10.5627 10.8272 10.6215 10.7601 10.6584 10.6807C10.6952 10.6013 10.7086 10.513 10.6969 10.4263C10.6852 10.3395 10.649 10.2579 10.5924 10.1911L10.5925 10.1911L10.5903 10.1887C10.1398 9.68322 9.58597 9.28031 8.96633 9.0072C8.34718 8.73431 7.6767 8.59738 7.00014 8.60564C6.32357 8.59738 5.65309 8.73431 5.03394 9.0072C4.4143 9.28031 3.8605 9.68322 3.40995 10.1887L3.40992 10.1887L3.40781 10.1912C3.3689 10.2372 3.33943 10.2904 3.32108 10.3479C3.30274 10.4053 3.29589 10.4657 3.30091 10.5258C3.30594 10.5858 3.32274 10.6443 3.35037 10.6979C3.378 10.7515 3.4159 10.7991 3.46193 10.838C3.50795 10.8769 3.56118 10.9064 3.61859 10.9247C3.676 10.943 3.73647 10.9499 3.79653 10.9449C3.85659 10.9398 3.91507 10.923 3.96863 10.8954C4.02164 10.8681 4.0688 10.8307 4.10749 10.7853C4.47054 10.3796 4.91625 10.0564 5.41465 9.83743C5.91354 9.61821 6.45362 9.50848 6.99849 9.51564L6.99849 9.51568L7.00178 9.51564C7.54666 9.50848 8.08674 9.61821 8.58562 9.83743C9.08403 10.0564 9.52975 10.3796 9.89279 10.7853C9.93569 10.8356 9.98895 10.876 10.0489 10.9038C10.1094 10.9318 10.1753 10.9463 10.242 10.9463ZM10.242 10.9463C10.242 10.9463 10.2419 10.9463 10.2419 10.9463L10.242 10.8213L10.2421 10.9463C10.2421 10.9463 10.242 10.9463 10.242 10.9463Z"
        strokeWidth="0.25"
      />
    </svg>
  ),
  back: (
    <svg viewBox="0 0 25 12" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M7.15039 11L2.05648 6L7.15039 0.999999"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <path d="M2 5.98346L24 5.98346" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  ),
  next: (
    <svg viewBox="0 0 25 12" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M18.3203 1L23.4142 6L18.3203 11"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <path
        d="M23.4707 6.01654L1.4707 6.01654"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  ),
  edit: (
    <svg
      width="14"
      height="14"
      viewBox="0 0 14 14"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M9.80745 0.77401L9.80761 0.773845C9.97787 0.595154 10.2095 0.506592 10.4397 0.506592C10.6698 0.506592 10.902 0.59507 11.0719 0.774005L12.8667 2.66423C13.2111 3.02696 13.2111 3.61443 12.8667 3.97716L11.3455 5.57923L4.67238 12.6079C4.66376 12.617 4.6549 12.6236 4.6485 12.6278C4.64048 12.6339 4.63356 12.638 4.63028 12.6399C4.59624 12.6673 4.55912 12.6875 4.51982 12.701C4.50975 12.707 4.49468 12.7142 4.47592 12.718M9.80745 0.77401L4.45105 12.5955M9.80745 0.77401L1.61314 9.40527L1.61312 9.40528C1.60704 9.41169 1.60254 9.41775 1.59938 9.42248C1.59833 9.42404 1.59738 9.42553 1.59653 9.42693L9.80745 0.77401ZM4.47592 12.718C4.47485 12.7182 4.47376 12.7184 4.47265 12.7186L4.45105 12.5955M4.47592 12.718L4.47681 12.7178L4.45105 12.5955M4.47592 12.718L1.33289 13.3798L1.30564 13.2578M4.45105 12.5955L1.30564 13.2578M1.30564 13.2578L1.33139 13.3801L1.33211 13.38L1.30564 13.2578ZM1.52113 9.57997C1.52396 9.56935 1.52777 9.56149 1.53012 9.55713L1.53279 9.55248C1.53302 9.55211 1.53333 9.55162 1.53251 9.55291L1.53236 9.55313C1.53149 9.55448 1.52855 9.55905 1.52534 9.56508C1.52385 9.57 1.52245 9.57497 1.52113 9.57997ZM1.52113 9.57997L1.5211 9.57996L1.5204 9.58289C1.52064 9.58189 1.52088 9.58092 1.52113 9.57997ZM10.3845 1.30175C10.3721 1.30734 10.3602 1.31566 10.3496 1.32677L9.09091 2.65245L11.0742 4.74122L12.324 3.42494C12.3777 3.36834 12.3777 3.27358 12.324 3.21699L10.5292 1.32677L10.5281 1.32553L10.5281 1.32552C10.5278 1.32524 10.5263 1.32364 10.5216 1.3206C10.5166 1.31739 10.5104 1.31398 10.5001 1.30863C10.494 1.30565 10.4887 1.30257 10.4844 1.2998L10.4817 1.29945L10.3845 1.30175ZM10.3845 1.30175L10.3849 1.30169L10.3916 1.3008C10.3964 1.30015 10.4036 1.29907 10.4117 1.29725M10.3845 1.30175L10.462 1.29644C10.4537 1.29491 10.4464 1.29306 10.4415 1.29178L10.4379 1.29079L10.4305 1.29272C10.4257 1.29399 10.4191 1.29568 10.4117 1.29725M10.4117 1.29725C10.4112 1.29735 10.4107 1.29746 10.4102 1.29757L10.3851 1.17511L10.4136 1.29682C10.4129 1.29697 10.4123 1.29711 10.4117 1.29725ZM0.882171 12.9184L1.00498 12.9417L0.882199 12.9182L0.882171 12.9184ZM1.68745 9.51714L1.58757 9.44198C1.58634 9.44362 1.58512 9.44527 1.58391 9.44692L1.58292 9.44869C1.5826 9.44927 1.58255 9.44936 1.58261 9.44925L1.58262 9.44924C1.58277 9.44898 1.58384 9.44715 1.58564 9.44462L1.68745 9.51714ZM1.51088 9.60653C1.51071 9.60748 1.51055 9.60844 1.51039 9.60942L1.63386 9.62896L1.51105 9.60564L1.51088 9.60653ZM2.41775 9.68164L8.55816 3.21408L10.5414 5.30284L4.40052 11.7699L2.41775 9.68164ZM3.63769 12.0903L1.73806 12.4904L2.11799 10.4897L3.63769 12.0903Z"
        fill="#2C2C2C"
        stroke="#2C2C2C"
        strokeWidth="0.25"
      />
    </svg>
  ),
};

type Props = {
  className?: string;
  type: IconType;
};

const Icon: React.FC<Props> = ({ className, type }: Props) => {
  return React.cloneElement(IconSvgs[type], { className });
};

export default Icon;
