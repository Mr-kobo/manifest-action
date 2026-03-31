<template>
	<div class="flex justify-between items-center gap-2">
	    <u-input 
		v-for="(cell, index) in cells"
		:key="`pincell_${index}`"
		type="number"
		:ref="(el) => {
			pincells[index] = el;
		}"
		v-model="code[index]"
		:class="props.class"
		:disabled="isDisabled"
		:input-class="inputClass"
		:maxlength="cells"
		@focus="onFocus(index)"
		@keyup="onKeyUp"
		placeholder="0"/>
    </div>
</template>

<script setup lang="ts">
const props = defineProps({
	cells: { type: Number, required: true },
	class: { type: String, default: "!mx-1 !w-10 !p-0" },
	isDisabled: { type: Boolean, default: false },
	inputClass: { type: String, default: "text-lg text-center" },
});
const emit = defineEmits(["onCodeChange"]);

const pincells = reactive<Array<Element | ComponentPublicInstance | null>>([]);
let code = reactive<Array<Number | "">>([]);
let focusedCellIdx = ref(0);

const onKeyUp = (e: KeyboardEvent): void => {
	switch (e.key) {
		case 'Backspace':
		case 'ArrowLeft':
			focusPreviousCell();
			break;
		case 'ArrowRight':
			focusNextCell();
			break;
		default:
			const inputStringValue = code[focusedCellIdx.value].toString();
			if (inputStringValue.length > 1) {
				for (let i = 0; i < inputStringValue.length; i++) {
					const char = inputStringValue[i];
					setChar(char);
				}
			} else {
				setChar(e.key);
			}
			break;
	}
	// emit("onCodeChange", code.join(""));
};

const isValidChar = (char: string): boolean => {
	return !Number.isNaN(parseInt(char));
};

const setChar = (char: string) => {
	if (isValidChar(char)) {
		code[focusedCellIdx.value] = parseInt(char);
		focusNextCell();
	} else {
		if (char !== "Shift") code[focusedCellIdx.value] = "";
	}
	emit("onCodeChange", code.join(""));
};

const focusPreviousCell = (): void => {
	if (!focusedCellIdx.value) return;
	focusCellByIndex(focusedCellIdx.value - 1);
};

const focusNextCell = (): void => {
	if (focusedCellIdx.value < props.cells - 1) focusCellByIndex(focusedCellIdx.value + 1);
};

const focusCellByIndex = (index: number = 0): void => {
	const el: Element | globalThis.ComponentPublicInstance | null = pincells[index];
	if((el as any)?.$el){
		(el as any)?.$el?.querySelector('input').focus();
	}
	focusedCellIdx.value = index;
};

const onFocus = (index: number) => {
	focusedCellIdx.value = index;
	code[index] = "";
};

onMounted(() => {
	code = Array.from(Array(props.cells), () => "");
	focusCellByIndex(0);
});
</script>
<style>
  input[type="number"]::-webkit-inner-spin-button,
  input[type="number"]::-webkit-outer-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }

</style>