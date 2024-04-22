<script lang="ts">
import colorText from "./colorText.vue";

export default {
  name: "about",
  data() {
    return {
      aboutLine1: true,
      aboutLine2: false,
      aboutLine3: false,
      aboutLine4: false,
      aboutLine5: false,
      aboutLine6: false,
      aboutLine7: false,
      aboutLine8: false,
      aboutLine9: false,
      aboutLine10: false,
      aboutLine11: false,
      aboutLine12: false,
      displayAbout: true,
    };
  },
  components: {
    colorText,
  },
  props: {
    displayProject: Boolean,
  },
};
</script>

<style>
  .pl-6 {
    padding-left: 1.5rem;
  }

  @media only screen and (max-width: 768px) {
    [class*="w-[700px]"] {
      width: 100%;
    }
    [class*="m-2"] {
      margin: 0rem;
    }
  }

  @media only screen and (max-width: 430px) {
    [class*="w-[700px]"] {
      width: 100%;
    }
    [class*="m-2"] {
      margin: 0rem;
    }
    [class*="min-h-[310px]"] {
      height: 570px;
    }
  }
</style>

<template>
  <div
    class="container rounded-lg w-[700px] m-2 relative mb-24"
    style="background-color: #2a2a2a"
  >
    <div class="flex flex-row">
      <div
        class="container flex justify-start text-white p-2 gap-2"
        style="width: 75%"
      >
        <button
          class="rounded-full w-5 h-5 bg-[#00CA4E] hover:bg-[#33D571]"
        ></button>
        <button
          class="rounded-full w-5 h-5 bg-[#FFBD44] hover:bg-[#FFCA69]"
        ></button>
        <button
          class="rounded-full w-5 h-5 bg-[#FF605C] hover:bg-[#FF807D]"
        ></button>
      </div>
      <div class="container flex text-white p-2 pl-4 italic">
        <h2>About Me</h2>
      </div>
    </div>

    <div
      class="container bg-slate-400 min-h-[310px] rounded-bl-lg rounded-br-lg text-white p-2 font-mono"
      style="background-color: #191919"
    >
      <!-- block 1 -->
      <div class="text-[#FFB0AE] italic pl-3 flex flex-wrap">
        <colorText
          :printSpeed="20"
          :printStatus="aboutLine1"
          @printDone="aboutLine2 = true"
          printableText="// Hi my name is Caden Citro A.K.A Onion_jpg"
        ></colorText>
      </div>

      <!-- block 2 -->
      <div class="text-[#FFB0AE] italic pl-3 flex flex-wrap">
        <colorText
          :printSpeed="20"
          :printStatus="aboutLine2"
          @printDone="aboutLine3 = true"
          printableText="// I am a student studying Computer Science and Games at Miami University"
        ></colorText>
      </div>

      <!-- block 3 -->
      <div class="pl-3">
        <colorText
          :printSpeed="20"
          :printStatus="aboutLine3"
          @printDone="aboutLine4 = true"
          printableText="Links = {"
        ></colorText>
      </div>

      <!-- block 4 -->
      <div class="text-[#69C06C] italic pl-6 flex flex-wrap">
        <colorText
          :printSpeed="10"
          :printStatus="aboutLine4"
          @printDone="aboutLine5 = true"
          printableText="// My Github repository! Here you can find a list of my projects."
        ></colorText>
      </div>

      <!-- block 5 -->
      <div class="pl-6 flex flex-row">
        <colorText
          :printSpeed="20"
          :printStatus="aboutLine5"
          @printDone="aboutLine6 = true"
          printableText="Github: "
        ></colorText>
        <a
          v-if="aboutLine6"
          class="text-400 underline"
          href="https://github.com/Onion-JPG/portfolio"
          target="_blank"
          >Github.com/Onion-JPG/portfolio</a
        >
      </div>

      <!-- block 6 -->
      <div class="text-[#69C06C] italic pl-6 flex flex-wrap">
        <colorText
          :printSpeed="10"
          :printStatus="aboutLine6"
          @printDone="aboutLine7 = true"
          printableText="// Connect with me on linkedin!"
        ></colorText>
      </div>

      <!-- block 7 -->
      <div class="pl-6 flex flex-row">
        <colorText
          :printSpeed="20"
          :printStatus="aboutLine7"
          @printDone="aboutLine8 = true"
          printableText="LinkedIn: "
        ></colorText>
        <a
          v-if="aboutLine8"
          class="text-400 underline"
          href="https://www.linkedin.com/in/caden-citro/"
          target="_blank"
          >Linkedin.com/in/caden-citro/</a
        >
      </div>

      <!-- block 8 -->
      <div class="text-[#69C06C] italic pl-6 flex flex-wrap">
        <colorText
          :printSpeed="10"
          :printStatus="aboutLine8"
          @printDone="aboutLine9 = true"
          printableText="// A link to the Varsity program website I help develop and maintain."
        ></colorText>
      </div>

      <!-- block 9 -->
      <div class="pl-6 flex flex-row">
        <colorText
          :printSpeed="20"
          :printStatus="aboutLine9"
          @printDone="aboutLine10 = true"
          printableText="Varsity Esports Website: "
        ></colorText>
        <a
          v-if="aboutLine10"
          class="text-400 underline"
          href="https://redhawks.gg/"
          target="_blank"
          >Redhawks.gg</a
        >
      </div>

      <!-- block 10 -->
      <div class="text-[#69C06C] italic pl-6 flex flex-wrap">
        <colorText
          :printSpeed="10"
          :printStatus="aboutLine10"
          @printDone="aboutLine11 = true"
          printableText="// A link to my itch.io website where I post games I make."
        ></colorText>
      </div>

      <!-- block 11 -->
      <div class="pl-6 flex flex-row">
        <colorText
          :printSpeed="20"
          :printStatus="aboutLine11"
          @printDone="aboutLine12 = true"
          printableText="Itch.io site: "
        ></colorText>
        <a
          v-if="aboutLine12"
          class="text-400 underline"
          href="https://onion-jpg.itch.io//"
          target="_blank"
          >Onion-jpg.itch.io</a
        >
      </div>

      <!-- block 12 -->
      <div class="pl-3">
        <colorText
          :printSpeed="20"
          :printStatus="aboutLine12"
          printableText="}"
        ></colorText>
      </div>

    </div>
  </div>
</template>
