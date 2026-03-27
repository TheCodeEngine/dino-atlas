// @dino-atlas/ui - Component Library

// Types
export type { MinigameDino } from "./types/minigame";
export { StoryCard } from "./components/StoryCard";

// Primitives
export { Button } from "./primitives/Button";
export { TextInput } from "./primitives/TextInput";
export { Divider } from "./primitives/Divider";
export { TabBar } from "./primitives/TabBar";
export { Icon } from "./primitives/Icon";
export { Card } from "./primitives/Card";
export { ProgressBar } from "./primitives/ProgressBar";
export { Avatar } from "./primitives/Avatar";
export { IconButton } from "./primitives/IconButton";
export { StarRating } from "./primitives/StarRating";
export { Skeleton } from "./primitives/Skeleton";

// Components
export { AudioPlayer, TtsContext } from "./components/AudioPlayer";
export type { TtsContextValue, AudioPlayerStatus } from "./components/AudioPlayer";
export { FormCard } from "./components/FormCard";
export { PageHeader } from "./components/PageHeader";
export { TopBar } from "./components/TopBar";
export { ForscherSpeech } from "./components/ForscherSpeech";
export { PlayerCard } from "./components/PlayerCard";
export { StatusBadge } from "./components/StatusBadge";
export { ActionCard } from "./components/ActionCard";
export { BottomNav } from "./components/BottomNav";
export { AppShell } from "./components/AppShell";
export { FullscreenHeader } from "./components/FullscreenHeader";
export { MinigameShell } from "./components/MinigameShell";
export { PlayerSwitcher } from "./components/PlayerSwitcher";
export { TimeSlider } from "./components/TimeSlider";
export { ImageSwitcher } from "./components/ImageSwitcher";
export { MuseumTransition, LandScene } from "./components/museum-transition";
export { SkeletonBreakTransition } from "./components/skeleton-break-transition";
export { ExpeditionIntro } from "./components/ExpeditionIntro";
export { DinoHeader } from "./components/DinoHeader";
export { FactCarousel } from "./components/FactCarousel";
export { DinoMapCarousel, buildDefaultMapCards } from "./components/DinoMapCarousel";
export { InteractiveDino } from "./components/InteractiveDino";
export { DesertScene, DESERT_CONFIG, JungleScene, JUNGLE_CONFIG, IceScene, ICE_CONFIG, OceanScene, OCEAN_CONFIG } from "./components/biom-scene";

// Hooks
export { useHaptics } from "./hooks/useHaptics";

// Minigames
export { ExcavationGame } from "./minigames-excavation/ExcavationGame";

// Screens
export {
  DiscoveryScreen,
  ExcavationScreen,
  ExpeditionIntroScreen,
  FoodMatchScreen,
  HomeScreen,
  IdentifyScreen,
  LoginScreen,
  MainDashboard,
  MinigameSelectScreen,
  MuseumDetailScreen,
  MuseumScreen,
  OfflineTaskScreen,
  ParentDashboardScreen,
  ParentResetScreen,
  PhotoUploadScreen,
  PlayerSelectScreen,
  PuzzleScreen,
  QuizScreen,
  ShadowGuessScreen,
  SizeSortScreen,
  SleepyDinosScreen,
  StoryLibraryScreen,
  StoryTimeScreen,
  TimelineSortScreen,
} from "./screens";
export type { StoryPreview } from "./screens";
export type { StoryDino } from "./screens";
