import color from "color";

import { Dimensions, PixelRatio, Platform } from "react-native";

const deviceHeight = Dimensions.get("window").height;
const deviceWidth = Dimensions.get("window").width;
const platform = Platform.OS;
const platformStyle = undefined;
const isIphoneX =
	      platform === "ios" && (deviceHeight === 812 || deviceWidth === 812);

export default {
	platformStyle,
	platform,
	
	//Accordion
	headerStyle:          "#121412",
	iconStyle:            "#fff",
	contentStyle:         "#0a0b0a",
	expandedIconStyle:    "#fff",
	accordionBorderColor: "#2c2c2c",
	
	// Android
	androidRipple:           true,
	androidRippleColor:      "rgba(0, 0, 0, 0.3)",
	androidRippleColorDark:  "rgba(256, 256, 256, 0.15)",
	btnUppercaseAndroidText: true,
	
	// Badge
	badgeBg:      "#12e8d8",
	badgeColor:   "#000",
	badgePadding: platform === "ios" ? 3 : 0,
	
	// Button
	btnFontFamily: platform === "ios" ? "System" : "Roboto_medium",
	btnDisabledBg: "#4a4a4a",
	buttonPadding: 6,
	get btnPrimaryBg() {
		return this.brandPrimary;
	},
	get btnPrimaryColor() {
		return this.inverseTextColor;
	},
	get btnInfoBg() {
		return this.brandInfo;
	},
	get btnInfoColor() {
		return this.inverseTextColor;
	},
	get btnSuccessBg() {
		return this.brandSuccess;
	},
	get btnSuccessColor() {
		return this.inverseTextColor;
	},
	get btnDangerBg() {
		return this.brandDanger;
	},
	get btnDangerColor() {
		return this.inverseTextColor;
	},
	get btnWarningBg() {
		return this.brandWarning;
	},
	get btnWarningColor() {
		return this.inverseTextColor;
	},
	get btnTextSize() {
		return platform === "ios" ? this.fontSizeBase * 1.1 : this.fontSizeBase - 1;
	},
	get btnTextSizeLarge() {
		return this.fontSizeBase * 1.5;
	},
	get btnTextSizeSmall() {
		return this.fontSizeBase * 0.8;
	},
	get borderRadiusLarge() {
		return this.fontSizeBase * 3.8;
	},
	get iconSizeLarge() {
		return this.iconFontSize * 1.5;
	},
	get iconSizeSmall() {
		return this.iconFontSize * 0.6;
	},
	
	// Card
	cardDefaultBg:    "#000",
	cardBorderColor:  "#333",
	cardBorderRadius: 2,
	cardItemPadding:  platform === "ios" ? 10 : 12,
	
	// CheckBox
	CheckboxRadius:        platform === "ios" ? 4 : 0,
	CheckboxBorderWidth:   platform === "ios" ? 1 : 2,
	CheckboxPaddingLeft:   platform === "ios" ? 4 : 2,
	CheckboxPaddingBottom: platform === "ios" ? 0 : 5,
	CheckboxIconSize:      platform === "ios" ? 21 : 16,
	CheckboxIconMarginTop: platform === "ios" ? undefined : 1,
	CheckboxFontSize:      platform === "ios" ? 23 / 0.9 : 17,
	checkboxBgColor:       "#fc641a",
	checkboxSize:          20,
	checkboxTickColor:     "#000",
	
	// Color
	brandPrimary: platform === "ios" ? "#ff8500" : "#c0ae4a",
	brandInfo:    "#62B1F6",
	brandSuccess: "#5cb85c",
	brandDanger:  "#d9534f",
	brandWarning: "#f0ad4e",
	brandDark:    "#000",
	brandLight:   "#f4f4f4",
	
	//Container
	containerBgColor: "#000",
	
	//Date Picker
	datePickerTextColor: "#fff",
	datePickerBg:        "transparent",
	
	// Font
	DefaultFontSize: 16,
	fontFamily:      platform === "ios" ? "System" : "Roboto",
	fontSizeBase:    15,
	get fontSizeH1() {
		return this.fontSizeBase * 1.8;
	},
	get fontSizeH2() {
		return this.fontSizeBase * 1.6;
	},
	get fontSizeH3() {
		return this.fontSizeBase * 1.4;
	},
	
	// Footer
	footerHeight:        55,
	footerDefaultBg:     platform === "ios" ? "#070707" : "#c0ae4a",
	footerPaddingBottom: 0,
	
	// FooterTab
	tabBarTextColor:        platform === "ios" ? "#949494" : "#4c3806",
	tabBarTextSize:         platform === "ios" ? 14 : 11,
	activeTab:              platform === "ios" ? "#ff8500" : "#000",
	sTabBarActiveTextColor: "#ff8500",
	tabBarActiveTextColor:  platform === "ios" ? "#ff8500" : "#000",
	tabActiveBgColor:       platform === "ios" ? "#321e06" : "#c0ae4a",
	
	// Header
	toolbarBtnColor:       platform === "ios" ? "#ff8500" : "#000",
	toolbarDefaultBg:      platform === "ios" ? "#070707" : "#070707",
	toolbarHeight:         platform === "ios" ? 64 : 56,
	toolbarSearchIconSize: platform === "ios" ? 20 : 23,
	toolbarInputColor:     platform === "ios" ? "#31322d" : "#000",
	searchBarHeight:       platform === "ios" ? 30 : 40,
	searchBarInputHeight:  platform === "ios" ? 30 : 50,
	toolbarBtnTextColor:   platform === "ios" ? "#ff8500" : "#000",
	toolbarDefaultBorder:  platform === "ios" ? "#585954" : "#c0ae4a",
	iosStatusbar:          platform === "ios" ? "light-content" : "dark-content",
	get statusBarColor() {
		return color(this.toolbarDefaultBg)
			.darken(0.2)
			.hex();
	},
	get darkenHeader() {
		return color(this.tabBgColor)
			.darken(0.03)
			.hex();
	},
	
	// Icon
	iconFamily:     "Ionicons",
	iconFontSize:   platform === "ios" ? 30 : 28,
	iconHeaderSize: platform === "ios" ? 33 : 24,
	
	// InputGroup
	inputFontSize:           17,
	inputBorderColor:        "#262a23",
	inputSuccessBorderColor: "#2b8339",
	inputErrorBorderColor:   "#ed2f2f",
	inputHeightBase:         50,
	get inputColor() {
		return this.textColor;
	},
	get inputColorPlaceholder() {
		return "#a8a8a8";
	},
	
	// Line Height
	btnLineHeight:    19,
	lineHeightH1:     32,
	lineHeightH2:     27,
	lineHeightH3:     22,
	lineHeight:       platform === "ios" ? 20 : 24,
	listItemSelected: platform === "ios" ? "#ff8500" : "#c0ae4a",
	
	// List
	listBg:               "transparent",
	listBorderColor:      "#363636",
	listDividerBg:        "#0b0b0b",
	listBtnUnderlayColor: "#222",
	listItemPadding:      platform === "ios" ? 10 : 12,
	listNoteColor:        "#7f7f7f",
	listNoteSize:         13,
	
	// Progress Bar
	defaultProgressColor: "#1bdfd2",
	inverseProgressColor: "#e5e6e4",
	
	// Radio Button
	radioBtnSize:              platform === "ios" ? 25 : 23,
	radioSelectedColorAndroid: "#c0ae4a",
	radioBtnLineHeight:        platform === "ios" ? 29 : 24,
	get radioColor() {
		return this.brandPrimary;
	},
	
	// Segment
	segmentBackgroundColor:       platform === "ios" ? "#070707" : "#c0ae4a",
	segmentActiveBackgroundColor: platform === "ios" ? "#ff8500" : "#000",
	segmentTextColor:             platform === "ios" ? "#ff8500" : "#000",
	segmentActiveTextColor:       platform === "ios" ? "#000" : "#c0ae4a",
	segmentBorderColor:           platform === "ios" ? "#ff8500" : "#000",
	segmentBorderColorMain:       platform === "ios" ? "#585954" : "#c0ae4a",
	
	// Spinner
	defaultSpinnerColor: "#ba2a91",
	inverseSpinnerColor: "#e5e6e4",
	
	// Tab
	tabDefaultBg:               platform === "ios" ? "#070707" : "#c0ae4a",
	topTabBarTextColor:         platform === "ios" ? "#949494" : "#4c3806",
	topTabBarActiveTextColor:   platform === "ios" ? "#ff8500" : "#000",
	topTabBarBorderColor:       platform === "ios" ? "#585954" : "#000",
	topTabBarActiveBorderColor: platform === "ios" ? "#ff8500" : "#000",
	
	// Tabs
	tabBgColor:  "#070707",
	tabFontSize: 15,
	
	// Text
	textColor:        "#fff",
	inverseTextColor: "#000",
	noteFontSize:     14,
	get defaultTextColor() {
		return this.textColor;
	},
	
	// Title
	titleFontfamily:  platform === "ios" ? "System" : "Roboto_medium",
	titleFontSize:    platform === "ios" ? 17 : 19,
	subTitleFontSize: platform === "ios" ? 11 : 14,
	subtitleColor:    platform === "ios" ? "#71716c" : "#000",
	titleFontColor:   platform === "ios" ? "#fff" : "#000",
	
	// Other
	borderRadiusBase:              platform === "ios" ? 5 : 2,
	borderWidth:                   1 / PixelRatio.getPixelSizeForLayoutSize(1),
	contentPadding:                10,
	dropdownLinkColor:             "#bebebd",
	inputLineHeight:               24,
	deviceWidth,
	deviceHeight,
	isIphoneX,
	inputGroupRoundedBorderRadius: 30,
	
	//iPhoneX SafeArea
	Inset: {
		portrait:  {
			topInset:    24,
			leftInset:   0,
			rightInset:  0,
			bottomInset: 34
		},
		landscape: {
			topInset:    0,
			leftInset:   44,
			rightInset:  44,
			bottomInset: 21
		}
	}
};
