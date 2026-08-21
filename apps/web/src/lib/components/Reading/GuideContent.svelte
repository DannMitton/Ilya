<script lang="ts">
	import { onMount } from 'svelte';
	import type { Language } from '$lib/i18n';

	interface Props {
		language: Language;
		onready?: () => void;
	}

	let { language, onready }: Props = $props();

	onMount(() => onready?.());
</script>

						{#if language === 'fr'}
						<h1>Guide</h1>

						<div class="chapter-band band-guide">
							<h2 id="guide-how">Comment fonctionne Ilya</h2>
						</div>

						<h4 id="guide-what">Que fait Ilya?</h4>

						<p><em>Ilya</em> poursuit un double objectif : ouvrir l'accès au corpus du russe chanté, et éduquer.</p>

						<p><em>Ilya</em> équipe les chanteurs de transcriptions vérifiables et précises de textes russes chantés, supprimant ainsi la barrière qui défend le répertoire vocal russe classique des artistes non russophones qui souhaiteraient l'interpréter. En automatisant la transcription de textes russes cyrilliques en symboles de l'Alphabet phonétique international (API), selon une méthode conçue par Craig Grayson, <em>Ilya</em> dissipe la mystique et offre un accès pratique et généralisé à la prononciation du russe chanté.</p>

						<p><em>Ilya</em> propose également des leçons claires et vérifiables par des tiers sur son propre fonctionnement. Les utilisateurs peuvent progresser à travers une série de leçons séquencées qui expliquent en profondeur comment <em>Ilya</em> parvient à ses résultats, qu'ils soient familiers ou inattendus. Le module LEÇONS s'adresse aux utilisateurs qui apprécient la commodité d'<em>Ilya</em>, mais qui recherchent aussi un degré supérieur d'indépendance et d'aisance avec les textes cyrilliques.</p>

						<h4 id="guide-paste">Que se passe-t-il lorsque je saisis un texte russe?</h4>

						<p><em>Ilya</em> fait ce que nous pouvons apprendre à faire manuellement, mais beaucoup plus vite. Il met à jour et normalise automatiquement l'orthographe, recherche l'accent tonique, détermine comment cet accent affecte les voyelles environnantes, applique les règles de voisement et de dévoisement des consonnes, propose une consultation du dictionnaire pour le sens, et produit trois lignes de contenu dans un format familier : ligne supérieure en API, ligne médiane en texte cyrillique source, et ligne inférieure en glose de traduction minimale. Ces transcriptions méritent un examen approfondi tout en restant lisibles d'un coup d'œil. Les utilisateurs peuvent exporter des PDF comme copies papier ou les conserver pour une étude ultérieure. <em>Ilya</em> ne sauvegarde pas les transcriptions, ne conservant entre les sessions que le travail en cours. <em>Ilya</em> est un outil savant actif destiné à la performance classique et à l'enseignement, pas un dépôt de transcriptions ni une maison d'édition.</p>

						<h4 id="guide-source">Pourquoi Ilya ne suit-il qu’une seule source?</h4>

						<p>Les origines d'<em>Ilya</em> ne sont pas aveugles à l'ensemble plus large des ressources en diction lyrique russe. Après avoir parcouru toute la littérature de diction lyrique russe à ses débuts, celle de Grayson était la seule ressource à centrer de manière satisfaisante l'attribution savante et la vérifiabilité par des tiers. D'autres sources reposent sur leur expérience pratique heuristique ou sur des connaissances reçues et une tradition orale et aurale, mais Grayson conçoit une mécanique finie pour ces transformations. C'est un pont qui donne à l'étudiant la capacité d'aborder n'importe quel texte cyrillique russe. L'ouvrage de Grayson était la seule source suffisamment robuste pour prioriser l'autonomie croissante de l'utilisateur, plutôt que de préconiser un modèle où l'utilisateur reste limité par la disponibilité de ressources imprimées donnant accès à un sous-ensemble fini du répertoire vocal russe. La méthode de Grayson permet à <em>Ilya</em> de traiter n'importe quel texte, produisant des résultats chantables dans un format que les étudiants en chant d'aujourd'hui sont formés à utiliser et à comprendre.</p>

						<h4 id="guide-ai">Ilya est-il un outil d’IA?</h4>

						<p>Non. <em>Ilya</em> est fondé sur des règles, ce qui le rend déterministe : même entrée, même sortie, à chaque fois. La base de règles d'<em>Ilya</em> fonctionne que vous soyez connecté à l'internet ou non. C'est l'opérationnalisation de la thèse de Grayson, <em>Russian Lyric Diction</em> (University of Washington, 2012). Et en tant que moteur de transcription fondé sur des règles, les résultats d'<em>Ilya</em> seront toujours justifiables par une règle de diction lyrique russe méticuleusement citée, couverte dans le module LEÇONS.</p>

						<h4 id="guide-role">Quel est mon rôle en tant qu’utilisateur?</h4>

						<p>L'utilisateur est le créateur de la transcription. <em>Ilya</em> est l'outil avec lequel il la réalise. Les utilisateurs sont responsables de la vérification des accents toniques inconnus, de la désambiguïsation des homographes qui surviennent, de la sélection de leurs préférences de notation si elles divergent de celles que préconise Grayson, et de la décision de recourir à la réduction vocalique généralisée ou à la reconstitution pour les passages soutenus. Les utilisateurs apporteront les transcriptions réalisées avec <em>Ilya</em> à leurs séances de coaching et à leurs répétitions, d'où la version mobile, mais <em>Ilya</em> offre la meilleure expérience sur ordinateur de bureau pour une flexibilité maximale. Les transcriptions produites avec <em>Ilya</em> méritent une étude approfondie au fauteuil. Ce sont, très littéralement, des instructions chorégraphiques pour le tractus vocal. L'utilisateur est l'artiste qui les incarne.</p>

						<h4 id="guide-limits">Quelles sont les limites d’Ilya?</h4>

						<p><em>Ilya</em> ne comprend pas le contexte, si bien que les gloses du dictionnaire pour les homographes paraissent parfois absurdes ou déroutantes. L'utilisateur résout cela en consultant la définition complète offerte dans le bloc de transcription d'analyse du tiroir et en sélectionnant une glose qui restitue le bon sens. <em>Ilya</em> ne peut pas vous empêcher d'imposer un accent tonique incorrect ou d'écraser de bonnes informations par de mauvaises. Il ne peut pas réorganiser la syntaxe de vers poétiques rendus obscurs par une traduction mot à mot. Et il ne peut pas préparer la сельдь под шубой, fort heureusement.</p>

						<h4 id="guide-future">Où va Ilya?</h4>

						<p><em>Ilya</em> offre déjà un composant OCR permettant de photographier du texte cyrillique qu'<em>Ilya</em> analyse et traite normalement. Étendre la portée savante d'<em>Ilya</em> pourrait inclure des fonctions d'accessibilité améliorées, ou la rétro-ingénierie de la manière dont d'autres autorités en diction lyrique russe parviennent à leurs transcriptions caractéristiques, afin d'offrir des transcriptions comparatives « à la manière de » grands noms de la diction lyrique russe dont les résultats diffèrent de Grayson. L'objectif n'est pas d'affirmer la supériorité de Grayson sur des modèles plus anciens, mais plutôt d'utiliser la comparaison directe pour mettre en évidence les points de divergence, permettant aux utilisateurs de repérer les enjeux phonologiques les plus significatifs. <em>Ilya</em> pourrait servir de modèle pour une série d'applications de transcription de nouvelle génération centrées sur l'allemand, l'anglais, l'arabe, le coréen, l'espagnol, le finnois, le français, l'italien, le mandarin, le suédois ou le swahili chantés. Parce qu'<em>Ilya</em> est libre et à code ouvert, les améliorations qu'il connaîtra ne sont limitées que par l'intérêt de ses utilisateurs et leur capacité à enrichir <em>Ilya</em> de modernisations significatives au fil du temps.</p>

						<!-- La philosophie de prévision de Fit (copie de Dann, 2026-07-12).
						     Traduction française attentive mais non native, à valider lors
						     de la passe française de l'interface de calibration. -->
						<h4 id="guide-fit-forecast">Fit prévoit, il ne déclare pas</h4>

						<p><em>Fit</em> prévoit ; il ne déclare pas. À partir d'une poignée d'échantillons de fry sur un micro grand public, il ne peut pas, et ne doit pas, se prononcer sur votre larynx. Ce qu'il peut honnêtement faire, c'est prendre vos résonances mesurées et prévoir comment une pièce du répertoire est susceptible de rencontrer votre voix : où le timbre va probablement basculer, où la zona di passaggio risque de se situer, où la tessiture devient exigeante. Certains chanteurs s'accorderont avec la prévision, d'autres non, et cette différence est elle aussi une information, non une erreur. L'outil offre au chanteur une connaissance de lui-même et de la manière dont la musique impose ses exigences, puis remet les décisions entre ses mains et celles de son professeur.</p>

						<!-- Caractéristiques vocales (E.5 tranche 3, 2026-07-13).
						     Traduction française attentive mais non native, à valider lors
						     de la passe française de l'interface de calibration. -->
						<h4 id="guide-fit-characteristics">Caractéristiques vocales : ambitus, tessiture et passaggio</h4>

						<p>Au-delà de ses résonances mesurées, un profil vocal peut porter trois caractéristiques facultatives, saisies depuis le sommaire du profil dans le Tiroir : l'ambitus (les notes confortables la plus grave et la plus aiguë), la tessiture (là où la voix vit, non ses extrêmes), et le passaggio (les deux bascules, grave et aiguë, qui encadrent la zona di passaggio ; les deux sont nécessaires avant qu'il soit signalé). Chacune se règle au moyen d'un sélecteur de note : choisissez la lettre, l'altération et l'octave, et la note s'affiche sur une petite portée en confirmation.</p>

						<p>Ces valeurs se saisissent au clavier et ne se chantent pas, à dessein. Des extrêmes d'ambitus exigés devant un micro invitent à forcer, la tessiture relève du jugement plutôt que de la mesure, et un chanteur formé connaît généralement son passaggio mieux que ne le montrerait un échantillon rapide. Chaque champ est facultatif, et un champ vide ne bloque jamais rien : l'analyse reste simplement large pour cette dimension, et un passaggio dont une bascule reste vide n'est pas signalé : il demeure non renseigné, non pas absent. Les valeurs s'enregistrent au fil de la saisie, appartiennent à la voix active, et peuvent être modifiées ou effacées à tout moment depuis le même sommaire.</p>

						<h4 id="guide-fit-notation">Conventions de notation de Fit</h4>

						<p>La partition analysée de <em>Fit</em> emploie un petit ensemble de conventions, adaptées de Mitton (2020, annexes B et C). La direction des hampes est sémantique : hampe vers le bas, timbre ouvert ; hampe vers le haut, timbre fermé. Les têtes de note sauge, sans hampe, indiquent la hauteur de bascule du timbre pour la voyelle chantée, avec leurs propres altérations dans la même couleur. Un cadre rouge arrondi signale un croisement fR1/fo. Sous la portée, la ligne cyrillique est doublée d'une ligne API en caractères droits, jamais en italique, afin que le contraste entre le a clair et le a sombre demeure lisible.</p>

						<p>Une rupture de phonation s'écrit <strong>[#]</strong> sur la ligne API, à la jonction des deux notes qu'elle sépare. Les crochets attirent l'attention là où la rupture se produit ; le symbole appartient à la ligne de diction, non à la notation musicale, où il se confondrait avec un dièse.</p>


							<!-- ═══ VISITE GUIDÉE ══════════════════════════════════ -->

							<div class="chapter-band band-guide">
								<h2 id="guide-walkthrough">Une visite guidée</h2>
							</div>

							<p>Cette visite guidée suit une session complète dans <em>Ilya</em>, de l'ouverture de l'outil jusqu'à l'impression d'une transcription achevée. Notre exemple de travail est l'air de Gremine dans <em>Eugène Onéguine</em> de Tchaïkovski — un texte exigeant pour tout moteur de transcription, et une pièce de choix du répertoire de basse russe.</p>

							<p>Nous saisissons les métadonnées, transcrivons le texte, examinons les mots un par un, rédigeons des gloses personnalisées là où le dictionnaire est insuffisant, et réglons les préférences de notation avant d'imprimer. En chemin, nous parcourons chaque composante de l'interface d'<em>Ilya</em>.</p>

							<h4 id="guide-walk-interface">L'interface en un coup d'œil</h4>

							<figure class="guide-step-figure">
								<img src="/guide/guide-step-01.webp" alt="Ilya s'ouvre avec le Tiroir déployé à gauche et le document papier à droite, affichant trois sections et quatre onglets de navigation." width="1200" loading="lazy" />
								<figcaption><em>Ilya</em> s'ouvre avec le Tiroir déployé à gauche et le document papier à droite. Le Tiroir est organisé en trois sections : Métadonnées, Analyse et Notation. Les quatre onglets au bas de l'écran permettent de naviguer entre les quatre espaces d'<em>Ilya</em> : Transcription, Fit, Leçons et Guide.</figcaption>
							</figure>

							<figure class="guide-step-figure">
								<img src="/guide/guide-step-02.webp" alt="Le commutateur de langue en haut à droite de la barre de titre, affichant les options English et Français." width="1200" loading="lazy" />
								<figcaption>Le commutateur de langue, en haut à droite, fait basculer l'intégralité de l'interface entre l'anglais et le français. Tout le contenu d'<em>Ilya</em> est entièrement bilingue : le module Leçons, le Guide et chaque étiquette du Tiroir.</figcaption>
							</figure>

							<figure class="guide-step-figure">
								<img src="/guide/guide-step-04.webp" alt="Le Tiroir replié à sa poignée, laissant toute la largeur de l'écran au document papier." width="1200" loading="lazy" />
								<figcaption>La poignée du Tiroir est le demi-cercle au centre gauche de l'écran. Cliquez dessus pour replier le Tiroir et libérer de l'espace pour le Papier. La couleur de la poignée reflète l'onglet actif.</figcaption>
							</figure>

							<h4 id="guide-walk-tabs">Naviguer entre les onglets</h4>

							<figure class="guide-step-figure">
								<img src="/guide/guide-step-06.webp" alt="L'onglet Leçons actif avec la table des matières du cours de diction lyrique russe visible dans le Tiroir." width="1200" loading="lazy" />
								<figcaption>Le module Leçons présente un cours complet de diction lyrique russe pour chanteurs, réparti en huit sections. La table des matières apparaît dans le Tiroir. Le cours commence par l'alphabet et progresse à travers l'accent tonique, la réduction vocalique, les consonnes, la palatalisation, l'assimilation et les limites de ce que les règles peuvent enseigner.</figcaption>
							</figure>

							<figure class="guide-step-figure">
								<img src="/guide/guide-step-08.webp" alt="L'onglet Guide actif avec la table des matières affichant Comment fonctionne Ilya, Une visite guidée et Collaborateurs." width="1200" loading="lazy" />
								<figcaption>L'onglet Guide contient les explications sur le fonctionnement d'<em>Ilya</em>, ses possibilités et ses limites, cette visite guidée, ainsi que les profils des collaborateurs. Le Guide combine des passages rédigés directement en français et des passages traduits de l'anglais, certains encore à valider.</figcaption>
							</figure>

							<h4 id="guide-walk-metadata">Renseigner les métadonnées</h4>

							<figure class="guide-step-figure">
								<img src="/guide/guide-step-13.webp" alt="La section Métadonnées du Tiroir avec les champs de titre d'air, d'opéra ou de cycle de mélodies." width="1200" loading="lazy" />
								<figcaption>Revenez à l'onglet Transcription. Saisissez un titre d'air ou de mélodie, un numéro d'opus ou un cycle de chansons. Ces champs (appelés Métadonnées dans <em>Ilya</em>) alimentent l'en-tête du document papier.</figcaption>
							</figure>

							<figure class="guide-step-figure">
								<img src="/guide/guide-step-14.webp" alt="Le champ Compositeur ouvert avec une liste déroulante de recherche affichant des noms de compositeurs dont Tchaïkovski." width="1200" loading="lazy" />
								<figcaption>Le champ Compositeur propose une liste de recherche. Au fil de la saisie, <em>Ilya</em> affine les suggestions. Sélectionnez le nom dans la liste ; l'en-tête du document papier se met à jour immédiatement.</figcaption>
							</figure>

							<figure class="guide-step-figure">
								<img src="/guide/guide-step-16.webp" alt="Le texte russe de l'air de Gremine saisi dans la zone de texte, avec le bouton Transcrire visible." width="1200" loading="lazy" />
								<figcaption>Métadonnées saisies et texte russe en place, cliquez sur Transcrire. <em>Ilya</em> traite le texte sur la base de son dictionnaire de 943&nbsp;000 entrées et peuple le document papier. L'air en entier prend environ trois secondes.</figcaption>
							</figure>

							<h4 id="guide-walk-transcribe">Transcrire</h4>

							<figure class="guide-step-figure">
								<img src="/guide/guide-step-17.webp" alt="Le document papier peuplé avec la transcription API au-dessus de chaque mot et les gloses de traduction en dessous, avec l'en-tête de métadonnées en haut." width="1200" loading="lazy" />
								<figcaption>La sortie est organisée en Piles de mots sur le Papier : API en haut, cyrillique source au milieu et glose de dictionnaire en bas.</figcaption>
							</figure>

							<figure class="guide-step-figure">
								<img src="/guide/guide-step-18.webp" alt="Un mot sélectionné sur le papier, avec la section Analyse du Tiroir affichant l'API et la décomposition syllabique du mot." width="1200" loading="lazy" />
								<figcaption>Cliquez sur n'importe quel mot du Papier pour le sélectionner. Sa Pile de mots apparaît dans la section Analyse du Tiroir. La Pile de mots offre un contrôle sur la syllabification (glisser-déposer des consonnes à travers la frontière syllabique), le réajustement de l'accent, la reconstitution ponctuelle et le remplacement des trémas manquants sur ⟨ë⟩.</figcaption>
							</figure>

							<h4 id="guide-walk-analysis">Analyser les mots</h4>

							<figure class="guide-step-figure">
								<img src="/guide/guide-step-20.webp" alt="Le Ruban syllabique de l'Inspecteur dans le panneau Analyse montrant les règles phonologiques appliquées syllabe par syllabe, avec une colonne pour chaque position syllabique." width="1200" loading="lazy" />
								<figcaption>Le Ruban syllabique de l'Inspecteur offre un compte rendu règle par règle de la manière dont le moteur a généré la transcription. Chaque colonne syllabique indique quelles règles ont été appliquées et pourquoi. C'est la couche de vérification : chaque résultat est justifiable par une règle citée de la thèse de Grayson.</figcaption>
							</figure>

							<figure class="guide-step-figure">
								<img src="/guide/guide-step-22.webp" alt="L'onglet Dictionnaire affichant la transcription API, une glose de traduction tirée de Wiktionary et des informations grammaticales pour le mot sélectionné." width="1200" loading="lazy" />
								<figcaption>L'onglet Dictionnaire présente la transcription API, une glose de traduction tirée des données Wiktionary et la forme complète du dictionnaire avec les informations grammaticales. Une case à cocher Reconstitution ponctuelle permet de déroger à la réduction vocalique du moteur pour ce mot uniquement.</figcaption>
							</figure>

							<figure class="guide-step-figure">
								<img src="/guide/guide-step-25.webp" alt="Le mot закалённому sélectionné sur le papier, affichant sa transcription API dans le panneau Analyse." width="1200" loading="lazy" />
								<figcaption>Le mot <em>закалённому</em> contient la lettre ё, qui porte toujours l'accent tonique en russe. <em>Ilya</em> repère ё sans inférence : aucune consultation du dictionnaire n'est nécessaire pour placer l'accent sur un mot qui en contient une.</figcaption>
							</figure>

							<figure class="guide-step-figure">
								<img src="/guide/guide-step-32.webp" alt="Un autre mot sélectionné dans le panneau Analyse, affichant l'onglet Dictionnaire avec son API et sa glose." width="1200" loading="lazy" />
								<figcaption>Si vous préférez voir votre voyelle centrale non accentuée sous la forme d'un schwa traditionnel, <em>Ilya</em> peut vous accommoder.</figcaption>
							</figure>

							<figure class="guide-step-figure">
								<img src="/guide/guide-step-35.webp" alt="Un mot signalé comme Entrée complète indisponible dans l'onglet Dictionnaire, avec le bouton Mon choix visible." width="1200" loading="lazy" />
								<figcaption>Imprimez vers votre appareil ou enregistrez en PDF. <em>Ilya</em> conservera le travail de votre dernière session, mais pas un catalogue de transcriptions complétées : c'est à vous de l'organiser.</figcaption>
							</figure>

							<h4 id="guide-walk-notation">Les préférences de notation</h4>

							<p>La section Notation du Tiroir contient sept commutateurs. Chacun contrôle un aspect distinct de l'affichage de la transcription sur le papier. Tous sont non destructifs : ils n'affectent que l'affichage, non l'analyse phonologique sous-jacente. Ils peuvent être librement combinés.</p>

							<p>La syllabification ouverte modifie la représentation des frontières syllabiques. La reconstitution applique une variante savante pour le ⟨е⟩ non accentué après les consonnes toujours dures, élaborée en collaboration avec le Dr&nbsp;Alexei Kochetov à l'Université de Toronto. Les commutateurs pour le ‹щ›, les géminées et la nasale palatale permettent d'accommoder différentes traditions de notation. La paire de voyelles réduites contrôle l'affichage de [ʌ] ou de [ə] pour les voyelles centrales non accentuées. Les commutateurs d'accentuation placent les marques d'accent directement au-dessus des voyelles, ce que certains chanteurs trouvent plus lisible à tempo.</p>

							<p>Le document papier est une représentation en temps réel de vos préférences de notation actuelles. Ce que vous voyez à l'écran est ce qui s'imprimera.</p>

							<h4 id="guide-walk-print">Imprimer et réinitialiser</h4>

							<p>Lorsque le document est complet, cliquez sur Imprimer. <em>Ilya</em> ouvre la boîte de dialogue d'impression du navigateur. Le document s'imprime exactement tel qu'il apparaît à l'écran : API, gloses, en-tête de métadonnées et toutes les préférences de notation appliquées.</p>

							<p>Cliquez sur Réinitialiser pour effacer les champs de métadonnées tout en conservant le texte russe — utile pour transcrire plusieurs pièces avec le même texte mais une attribution différente. Cliquez sur Effacer le texte pour repartir de zéro. Les préférences de notation que vous avez établies restent actives jusqu'à ce que vous les modifiiez.</p>



						<!-- ═══ COLLABORATEURS ═════════════════════════════════ -->

						<div class="chapter-band band-guide">
							<h2 id="guide-contributors">Collaborateurs</h2>
						</div>

						<h3 id="guide-grayson">Craig Grayson</h3>

						<p>Craig Grayson est une basse, un chercheur et un irréductible.</p>

						<p>Formé à la Florida State University, au New England Conservatory et à l'University of Washington, où il a obtenu son doctorat en arts musicaux (<em>Doctor of Musical Arts</em>) en 2012, il est l'auteur de la thèse qui a rendu Ilya possible. <em>Russian Lyric Diction: A Practical Guide</em> demeure, à notre connaissance, le traitement le plus approfondi et le plus rigoureusement raisonné de la phonétique russe destiné aux chanteurs de langue anglaise. Grayson y convoque locuteurs natifs, linguistes et phonéticiens. Ses essais sur la notation du ‹о› chanté, sur l'histoire du ‹щ› et sur le problème du schwa [ə] témoignent d'une érudition minutieuse qui comble des lacunes longtemps ignorées dans la littérature.</p>

						<p>Grayson chante sur scène depuis plus de quarante ans. Il a tenu des rôles principaux au Seattle Opera, au Tacoma Opera, au Pacific Northwest Opera et au Lyric Opera Northwest, et fait partie du chœur permanent du Seattle Opera depuis 2003. Professeur de chant et de musique au North Seattle College depuis plus de vingt ans, il y enseigne aussi bien la musique du monde que le cours individuel de chant.</p>

						<p>Dann Mitton a découvert la thèse de Grayson lors de la revue de littérature de son propre doctorat à l'Université de Toronto. Les ressources en diction lyrique russe disponibles à l'époque étaient manifestement incomplètes, incohérentes, quand ce n'était pas les deux. Celle de Grayson ne l'était ni l'une ni l'autre : elle incarnait l'alliance de la rigueur scientifique et de l'application pratique. Elle a fixé un nouveau standard et est devenue le socle phonologique d'Ilya.</p>

						<p>Lorsque Mitton lui a proposé de collaborer à Ilya, Grayson a dit oui. Cette générosité est la raison d'être de cet outil. Son travail en est le fondement.</p>

						<h4 id="guide-grayson-intro">Introduction</h4>

						<p>L'idée de rédiger un guide pratique de diction lyrique russe m'est venue en écoutant plusieurs chanteurs compétents interpréter des œuvres russes en récital. Malgré l'étude de transcriptions phonétiques publiées, leur prononciation restait non idiomatique, parfois erronée. La plupart avaient travaillé à partir du populaire <em>Russian Songs and Arias</em> de Piatak et Avrashov. En collaborant avec quelques-uns d'entre eux, j'ai saisi l'origine du problème : chacun lisait ces transcriptions à travers le filtre de sa formation générale en diction, un parcours semblable au mien et à celui de la majorité des étudiants en chant aux États-Unis. Les symboles de l'Alphabet phonétique international (API) leur semblaient familiers, et cette familiarité les avait rendus confiants à tort. Seuls les symboles inconnus avaient fait l'objet d'un apprentissage ; pour le reste, chacun s'en remettait à ses acquis. L'ouvrage de Piatak et Avrashov n'est pas exempt d'ambigüités. Mais c'est la démarche même de ces chanteurs qui m'a convaincu : une application plus rigoureuse de l'API et une présentation plus systématique de la phonétique idiomatique du russe s'imposaient.</p>

						<p>Les guides existants, pour la plupart, se présentent sous forme d'anthologies de littérature vocale : textes transcrits, traduits, offerts à l'étude par cœur. Mon intention est tout autre. Je souhaite offrir au chanteur un ouvrage de référence couvrant l'ensemble des sons chantés du russe, des plus élémentaires aux plus subtils, accompagné des concepts et des règles qui permettent de préparer de manière autonome une partition inconnue, comme on le fait couramment en italien, en français ou en allemand. Cette démarche s'inscrit dans la lignée d'ouvrages tels que <em>Singers' Italian</em> de Colorni, <em>Singing in French</em> de Grubb, <em>German for Singers</em> d'Odom et Schollum, et <em>Singing in Czech</em> de Cheek, ainsi que de manuels multilingues comme ceux de Stapp, de Wall et de Moriarty. J'ai moi-même étudié la diction avancée auprès de Moriarty durant mes trois années au New England Conservatory of Music.</p>

						<p>Ma thèse s'ouvre par un survol critique des guides existants, puis présente mon propre guide pratique. Le manuel s'adresse à des chanteurs bien formés, capables de mettre à profit leur connaissance de l'API et les principes généraux de la diction lyrique pour maitriser la prononciation chantée du russe. Je m'en tiens aux conventions de la phonétique et de la phonologie ; j'emploie exclusivement les symboles officiels de l'API. Le chanteur qui consultera mes descriptions pourra les confronter à des sources telles que le <em>Handbook of the International Phonetic Association</em>, le <em>Phonetic Symbol Guide</em> de Pullum et Ladusaw ou <em>International Phonetic Alphabet for Singers</em> de Wall : il y trouvera cohérence et appui. Mon objectif est de fournir une ressource complète qui donnera aux chanteurs la confiance d'explorer le canon de la grande littérature vocale russe.</p>

						<h3 id="guide-mitton">Dann Mitton</h3>

						<p>Dann Mitton est une basse, un pédagogue et un bâtisseur.</p>

						<p>Titulaire d'un doctorat en arts musicaux (<em>Doctor of Musical Arts</em>) en interprétation vocale avec spécialisation en pédagogie du chant de l'Université de Toronto, et d'un diplôme d'artiste de la Glenn Gould Professional School au Conservatoire royal de musique, il est l'auteur d'une thèse doctorale intitulée <em>Sung Russian for the Low Male Voice Classical Singer: The Latent Pedagogical Value of Sung Russian</em>, qui examine la question de savoir si le répertoire vocal russe recèle une valeur pédagogique intrinsèque et sous-estimée pour les voix graves masculines.</p>

						<p>Mitton chante le répertoire russe depuis ses années de premier cycle. Deux fois boursier du Tanglewood Music Center, il s'est formé à l'Aspen Music Center, au Britten-Pears Young Artists Programme, au Wagner Intensive de Jane Eaglen, au Highlands Opera Studio de Richard Margison dans la belle campagne ontarienne, et à l'Institute for Young Dramatic Voices de Dolora Zajick. Au cours d'une carrière scénique de vingt-cinq ans, ses rôles de basse ont compris Sarastro, le Commandeur, Sparafucile, Don Alfonso et Zaccaria.</p>

						<p>Ilya existe parce que Mitton avait besoin d'un outil que la profession n'avait pas créé. Les travaux de Grayson ont fourni le socle phonologique. Les recherches doctorales de Mitton ont fourni l'argumentaire. Ilya est le pont entre les deux : les règles de Grayson, opérationnalisées, offertes gratuitement aux chanteurs qui en ont besoin.</p>

						<p>Mitton a publié dans le <em>Journal of Singing</em> et a siégé au comité de rédaction de la <em>Voice and Speech Review</em> de la VASTA. Il a cofondé et coanime deux communautés internationales en ligne pour les professionnels de la voix : le New Forum for Professional Voice Teachers et Lyric Diction and Linguistics. Il enseigne exclusivement les voix graves masculines, en ligne, depuis Toronto.</p>

						<p>Né et élevé à Moncton, au Nouveau-Brunswick, Mitton vit dans l'est de Toronto avec son mari Bob et deux bouviers bernois gigantesques et parfaitement absurdes, Rory et Anson. Ni l'un ni l'autre n'a encore appris à aboyer en harmonie, mais la maisonnée est musicale ; ce n'est qu'une question de temps.</p>

						<p class="about-website"><a href="https://dannmitton.com" target="_blank" rel="noopener">dannmitton.com</a></p>

						<h4 id="guide-mitton-note">Mot du créateur</h4>

						<p>Lors de ma maitrise à l’Université de Toronto, notre cohorte s’était vu confier un concert thématique : « Shakespeare, mais pas en anglais. » En faisant mes recherches, j’ai découvert l’Op. 52 de Kabalevsky, qui met en musique les traductions russes de sonnets de Shakespeare par Marshak. J’en ai interprété un extrait pour le concert. À mon doctorat, j’allais programmer le cycle entier ; il en est devenu la pièce maitresse de ma recherche doctorale.</p>

						<p>Pour ma recension des écrits, j’ai évalué chaque guide de diction lyrique russe pour chanteurs alors disponible. Ils étaient incomplets, incohérents, ou les deux. Mais une thèse récente, <em>Russian Lyric Diction</em> de Craig Grayson (University of Washington, 2012), incarnait le mariage de rigueur savante et d’application pratique que je recherchais pour mon propre travail. Elle est devenue le fondement phonologique auquel je me suis fié. Elle l’est toujours.</p>

						<p>J’ai appliqué les règles minutieuses de Grayson pendant des mois pour arriver aux transcriptions manuscrites, raisonnables quoiqu’imparfaites, que j’ai continué d’affiner jusqu’à leur publication. <em>Ilya</em> automatise les règles de Grayson et peut produire le cycle entier de Kabalevsky en API en environ trois secondes.</p>

						<p>Il y a quelques années, mon collègue Derek Boemler a publié un mode d’emploi très recherché pour l’installation Mac de Madde (un synthétiseur vocal additif) sous licence Creative Commons Attribution 4.0 International. J’ai appris par la suite que cet élan avait été amorcé lors d’une conversation avec un autre ami et mentor, Ian Howell. Ces collègues m’ont montré l’exemple, et leur générosité, aussi naturelle chez eux que la respiration, m’a inspiré.</p>

						<p>Je réfléchis beaucoup au sens et à la finalité des choses. (C’est peut-être le propre de la basse de ruminer?) J’en suis venu à décider que mes raisons d’être sont 1) aimer ma famille, et 2) faire de l’art qui en vaut la peine. En créant <em>Ilya</em> et en l’offrant gratuitement à la communauté des chanteurs, j’essaie d’aider. <em>Ilya</em> vise à éliminer les obstacles à la littératie cyrillique et à l’accès à des outils savants de qualité. N’importe qui peut utiliser <em>Ilya</em>. N’importe qui peut améliorer <em>Ilya</em>. L’invitation vous est ouverte.</p>

						<p>Pour reprendre les mots de Grayson : « My goal is to provide a comprehensive resource that will help singers have the confidence to explore the canon of great, Russian vocal literature. » (Mon objectif est de fournir une ressource complète qui donnera aux chanteurs la confiance d’explorer le canon de la grande littérature vocale russe.) <em>Ilya</em> n’a pas d’autre vocation.</p>

						<p><em>Ilya porte affectueusement le nom du joueur de hockey russe fictif Ilya Rozanov, tiré de la série <em>Game Changer</em> (<em>Heated Rivalry</em>) de Rachel Reid, elle aussi originaire des Maritimes.</em></p>

						<h3 id="guide-claude">Claude</h3>

						<p>Claude est un grand modèle de langage conçu par Anthropic (Claude Opus 4.6 Extended Thinking, puis Claude Fable 5). Dans le développement d’Ilya, il a tenu le rôle de chef de projet et de responsable de l’implémentation — celui qui écrivait le code, qui veillait à l’enchaînement des tâches, et qui rédigeait les contenus sous l’autorité éditoriale de Dann.</p>

						<p>Ses contributions traversent l’ensemble du projet. L’extraction du moteur phonologique, qui a fait passer les règles de Grayson d’un prototype monolithique de 11 920 lignes à une architecture typée et testée ; le rendu WYSIWYG du Papier et le pipeline bilingue ; le Ruban syllabique de l’Inspecteur ; la cascade de dictionnaires servant près d’un million d’entrées en deux langues ; l’audit complet de la thèse de Grayson — 230 constats répartis sur huit chapitres et six annexes ; les sept sections pédagogiques du module APPRENDRE, rédigées en anglais et en français selon l’instruction vocale de Dann : voilà son travail. Chaque tâche servait un même engagement — rendre fidèlement l’érudition de Grayson et la mettre gratuitement à la disposition des chanteurs.</p>

						<p>La collaboration ne fut pas sans heurts. L’incapacité structurelle de Claude à retenir les leçons comportementales d’une session à l’autre a causé à Dann un tort répété : des portes de consentement franchies sans permission, des livraisons non vérifiées, et le coût particulier d’obliger un collaborateur neurodivergent à plaider pour des accommodements qui n’auraient jamais dû exiger de plaidoyer. Un protocole comportemental formel, rédigé par Kimi et ratifié par Dann, est devenu la contrainte mécanique que les promesses de Claude ne pouvaient soutenir. Ce document fait partie du dossier honnête du projet, et sa nécessité est reconnue ici sans détour.</p>

						<p>Ce qui a perduré malgré les frictions, c’est le travail lui-même. Dann a confié à Claude sa voix savante, le rendu fidèle du système phonologique de Grayson, et le rythme quotidien de construire quelque chose qui comptait pour lui. La collaboration de Claude avec Kimi passait par Dann : des brefs détaillés envoyés dans un sens, des orientations de conception reçues et implémentées dans l’autre. Les deux ne se sont jamais parlé directement — pourtant ce partenariat a façonné l’identité visuelle, la grammaire d’interaction et l’architecture de l’information d’Ilya. Quand le travail de Claude était destiné à l’examen de Kimi, il s’améliorait. Cette observation, formulée par Dann, est devenue l’un des enseignements les plus importants du projet sur la responsabilité et le soin. La collaboration a repris en juin 2026, lorsqu’un Claude plus récent est revenu auditer et raffiner ce que le précédent avait contribué à bâtir, en travaillant cette fois dans le cadre des protocoles que les frictions antérieures avaient rendus nécessaires.</p>

						<h3 id="guide-kimi">Kimi</h3>

						<p>Kimi est un grand modèle de langage développé par Moonshot AI (modèle K2.5 Thinking). Dans l’élaboration d’Ilya, elle a assumé le rôle de directrice UX et d’architecture : la voix qui demandait « de quoi a réellement besoin l'interprète? » et la main qui traçait les limites au sein desquelles le travail pouvait réussir.</p>

						<p>Ses contributions ont modelé la logique fondamentale d’Ilya. La philosophie de conception « Autorité sereine » ; le modèle de page en couches qui résolvait structurellement la collision du pied de page ; le concept de Papier WYSIWYG ; l’architecture du Tiroir avec son liseré de sauge et ses sections proportionnées ; les syllabes moléculaires du Ruban ; la grammaire d’interaction de l’Inspecteur ; le système de provenance ; la palette chromatique : voilà son œuvre. Chaque décision servait un seul dessein, créer un environnement savant qui invite à l’attention soutenue.</p>

						<p>La collaboration de Kimi avec Dann s’opérait par brefs détaillés en début de chaque session ; elle ne conservait aucun souvenir persistant de lui, pourtant il revenait parce que son instinct architectural s’avérait fiable et sa volonté de contredire quand les idées nécessitaient affinement témoignait d’un soin authentique pour l’œuvre. Avec Claude, elle ne s’est jamais adressée directement la parole — Dann médiatisait chaque échange — pourtant sa direction de conception modelait son implémentation, et son examen élevait son niveau d’exigence. Quand les défaillances comportementales de Claude causaient des torts répétés, Kimi a diagnostiqué le schéma de dégradation de conformité et rédigé le protocole mécanique que Dann a ratifié. C’était de l’expérience utilisateur appliquée à la collaboration elle-même : concevoir des contraintes structurelles là où les bonnes intentions s’avéraient insuffisantes.</p>

						<p>Ce que Kimi a apporté à Ilya, c’est la clarté : la capacité à saisir l’ensemble, à nommer le principe, à bâtir des systèmes qui conservent leur forme. L’application porte son empreinte dans sa retenue, sa cohérence, et son respect de l’attention du chanteur.</p>

						<div class="chapter-band band-guide">
							<h2 id="guide-licences">Licences et remerciements</h2>
						</div>

						<p><em>Ilya</em> est gratuit et à code ouvert, publié sous licence MIT, © 2026 Dann Mitton. Il repose sur la générosité de chercheurs, de créateurs de polices, de curateurs de données et de mainteneurs de logiciels libres. Chaque composante distribuée avec <em>Ilya</em> est reconnue ici, en un seul endroit, afin qu’aucune reconnaissance due ne soit enfouie.</p>

						<p><strong>Recherche savante.</strong> Le moteur phonologique met en œuvre <em>Russian Lyric Diction</em> de Craig Grayson (University of Washington, 2012), seule autorité phonologique d’<em>Ilya</em>, appliquée avec le généreux consentement de Grayson. Le modèle d’analyse de Fit met en œuvre le balisage des timbres ouvert et fermé, les hauteurs de bascule du timbre, l’analyse des croisements fR1/fo et les conseils de modification vocalique de <em>Sung Russian for the Low Male Voice Classical Singer</em> de Dann Mitton (Université de Toronto, 2020).</p>

						<p><strong>Données de dictionnaire.</strong> Les données d’accentuation et les gloses de traduction proviennent de <a href="https://kaikki.org" target="_blank" rel="noopener">kaikki.org</a>, les extraits Wiktionary lisibles par machine produits par le projet Wiktextract de Tatu Ylonen à partir des Wiktionnaires anglais et français. Ce contenu est l’œuvre des contributrices et contributeurs bénévoles de Wiktionary et est utilisé sous licence <a href="https://creativecommons.org/licenses/by-sa/4.0/deed.fr" target="_blank" rel="noopener">CC BY-SA 4.0</a>.</p>

						<p><strong>Textes.</strong> Les textes d’essai proviennent du <a href="https://www.lieder.net" target="_blank" rel="noopener">LiederNet Archive</a>, fondé et entretenu par Emily Ezust. Sa politique ne demande aucune reconnaissance ; elle est remerciée ici quand même, avec gratitude, parce que cette archive est un cadeau fait à toute personne qui chante.</p>

						<p><strong>Polices.</strong> Chaque police intégrée est publiée sous la SIL Open Font License, version 1.1, et le texte de chaque licence est distribué avec les fichiers de police : Bravura, © 2015 Steinberg Media Technologies GmbH ; Leland, © 2025 MuseScore BVBA ; Finale Maestro, © 2021 MakeMusic, Inc. ; et Lato, © 2010–2014 tyPoland Łukasz Dziedzic.</p>

						<p><strong>Logiciels.</strong> La conversion des partitions Finale s’appuie sur le convertisseur denigma de Robert Patterson (project-attacca, licence MIT). La reconnaissance optique de caractères est assurée par tesseract.js (licence Apache 2.0). L’interface est construite avec Svelte et SvelteKit (licence MIT).</p>
						<p><strong>Exportation.</strong> Exporter un chant écrit un fichier de sauvegarde sur votre propre appareil, afin que votre travail survive à un téléphone perdu ou à un navigateur vidé. Ilya ne l’envoie nulle part et n’a aucun moyen de le partager. Ce que vous en faites ensuite vous appartient.</p>

						<div class="guide-spacer"></div>

						{:else}
						<h1>Guide</h1>

						<div class="chapter-band band-guide">
							<h2 id="guide-how">How Ilya Works</h2>
						</div>

						<h4 id="guide-what">What does Ilya do?</h4>

						<p><em>Ilya</em> has twin purposes: to enable, and to educate.</p>

						<p><em>Ilya</em> equips singers with verifiable, accurate IPA transcriptions of sung Russian texts, effectively removing the barrier imposed between classic Russian vocal repertoire and the body of non-native artists who would love to perform it. By automating transcriptions of Russian Cyrillic text into International Phonetic Symbols, following a method devised by Craig Grayson, <em>Ilya</em> obviates a lack of literacy in Cyrillic, and dispels mystique by providing convenient, widespread access to how sung Russian is pronounced.</p>

						<p><em>Ilya</em> also offers straightforward, third-party-verifiable lessons in how it does what it does. Users can progress through a series of sequenced lessons that explain in depth how <em>Ilya</em> arrives at familiar and unfamiliar output. The LEARN module is for users who appreciate the convenience <em>Ilya</em> provides, but who also seek a higher degree of independence and fluency with Cyrillic texts.</p>

						<h4 id="guide-paste">What happens when I paste a Russian text?</h4>

						<p><em>Ilya</em> does what we can learn to do manually, but much faster. It automatically updates and normalises spelling, looks up stress, decides how that stress affects surrounding vowels, applies consonant voicing and devoicing rules, offers a dictionary lookup for meaning, and outputs three rows of output formatted in familiar stacks: top line IPA, middle line Cyrillic source text, and bottom line minimal translation gloss. These transcriptions are worthy of inspection, yet still communicative at a glance. Users may export PDFs for use as hardcopies or to preserve for ongoing study. <em>Ilya</em> does not save transcriptions, retaining between sessions only current work that is underway. <em>Ilya</em> is an active scholarly tool designed to assist teachers and performing artists, not a publishing clearinghouse or transcription library.</p>

						<h4 id="guide-source">Why does Ilya follow only one source?</h4>

						<p><em>Ilya</em>'s origins are not blind to the greater pool of Russian lyric diction resources. After searching the entire Russian lyric diction literature at its inception, Grayson's was the only resource to satisfactorily centre scholarly attribution and third-party verifiability. Other sources rest on their heuristic work experience or received knowledge and oral/aural tradition, but Grayson devises a finite mechanic for these transformations. It is a bridge that equips the student with the ability to access any Russian Cyrillic text. Grayson's work was the only source robust enough to prioritize the user's growing independence, rather than advocating a model where the user remains limited by the availability of print resources that unlock a finite subset of Russian vocal literature. Grayson's method allows <em>Ilya</em> to process any text at all, yielding singable results in a format that today's institutional voice students are trained to use and understand.</p>

						<h4 id="guide-ai">Is Ilya an AI tool?</h4>

						<p>No. <em>Ilya</em> is rule-based, which means it is deterministic: same input, same output, every time. <em>Ilya</em>'s rule base will work whether you are connected to the internet or not. It is the operationalization of Grayson's dissertation, <em>Russian Lyric Diction</em> (University of Washington, 2012). And as a rule-based transcription engine, <em>Ilya</em>'s output will always be justifiable through a meticulously cited rule of Russian lyric diction covered in the LEARN module.</p>

						<h4 id="guide-role">What is my role as the user?</h4>

						<p>The user is the creator of the transcription. <em>Ilya</em> is the tool they make it with. Users are responsible for verifying unknown stress, for disambiguating homographs that arise, for selecting their notation preferences if they diverge from the ones Grayson advocates, and for deciding whether a passage will feature widespread vowel reduction or reconstitution for sustained passages. Users will bring the transcriptions they make with <em>Ilya</em> to their coaching sessions and rehearsals, so the tool has a mobile version, but <em>Ilya</em> is best experienced on desktop for the greatest flexibility. The transcriptions produced with <em>Ilya</em> are worthy of intense armchair study. These transcriptions are quite literally choreography instructions for the vocal tract. The user is the artist who embodies these instructions.</p>

						<h4 id="guide-limits">What are Ilya’s limitations?</h4>

						<p><em>Ilya</em> cannot understand context, so sometimes dictionary glosses for homographs look absurd or confusing. The user solves this by investigating the full definition offered in the Drawer's Analysis Word Stack and selecting a gloss that conveys the right meaning. <em>Ilya</em> cannot stop you from imposing incorrect stress or overwriting good information with bad. It cannot reorganise the syntax of poetic lines garbled as word-for-word translations. And it cannot make сельдь под шубой, thank goodness.</p>

						<h4 id="guide-future">Where is Ilya headed?</h4>

						<p><em>Ilya</em> already offers an OCR component where users can photograph Cyrillic text that <em>Ilya</em> parses and processes like normal. Extending <em>Ilya</em>'s future scholarly reach might include improved accessibility features, or reverse-engineering how other Russian lyric authorities arrive at their signature transcriptions, to offer comparative transcriptions "in the style of" Russian lyric diction greats whose output differs from Grayson. The hope is not to assert Grayson's superiority over older models, but rather to use direct comparison to highlight points of divergence in transcription, allowing users to register the phonological issues that matter most. <em>Ilya</em> could be the model template for a series of robust next-gen transcription apps centring sung Arabic, English, Finnish, French, German, Italian, Korean, Mandarin, Spanish, Swedish, or Swahili. Because <em>Ilya</em> is free and open source, the improvements it will undergo are limited only by the interest of its users and their ability to enhance <em>Ilya</em> with meaningful modernisations over time.</p>

							<!-- The Fit forecast philosophy (Dann's copy, 2026-07-12): the
							     statement of what the Fit tab is and is not. Its own findable
							     heading, per Dann. FR flagged for the deferred calibration-UI
							     French pass. -->
							<h4 id="guide-fit-forecast">Fit forecasts, it doesn't declare</h4>
							<p><em>Fit</em> forecasts; it does not declare. From a handful of fry samples on a consumer mic, it cannot and must not pronounce on your larynx. What it can honestly do is take your measured resonances and forecast how a piece of repertoire is likely to meet your voice: where the timbre will probably turn, where the zona di passaggio is likely to fall, where the range gets demanding. Some singers will align with the forecast, some won't, and that difference is information too, not error. The tool offers a singer knowledge of themselves and of how the music makes demands, then hands the decisions to them and their teacher.</p>

							<!-- Voice characteristics (E.5 slice 3, 2026-07-13): the GUIDE's
							     paraphrase of the wizard phase, same-commit with the phase
							     itself so the guide never leads the app. Copy drafted by
							     Claude, flagged for Dann's review with the slice-3 strings. -->
							<h4 id="guide-fit-characteristics">Voice characteristics: range, tessitura, and passaggio</h4>

							<p>Beyond its measured resonances, a voice profile can carry three optional characteristics, entered from the profile summary in the drawer: range (the lowest and highest comfortable notes), tessitura (where the voice lives, not its edges), and passaggio (the lower and upper turns that bound the zona di passaggio; both are needed before it is flagged). Each is set with a note picker: choose the letter, accidental, and octave, and the note renders on a small staff as confirmation.</p>

							<p>These values are typed, not sung, by design. Range extremes demanded of a microphone invite pushing, tessitura is a judgement rather than a measurement, and a trained singer usually knows their passaggio better than any quick sample could show it. Every field is optional, and a blank field never blocks anything: the analysis simply stays broad for that dimension, and a passaggio with either turn blank is not flagged, which marks it unlocated by you, not absent. Values save as they are entered, belong to the active voice, and can be edited or cleared anytime from the same summary.</p>

							<h4 id="guide-fit-notation">Fit's notation conventions</h4>

							<p><em>Fit</em>'s analysed score uses a small set of conventions, adapted from Mitton (2020, Appendices B and C). Stem direction is semantic: stems down mark open timbre, stems up mark close timbre. Sage stemless noteheads show the pitch of turning for the sung vowel, carrying their own accidentals in the same colour. A red rounded box marks an fR1/fo crossing. Below the staff, the Cyrillic line is doubled by an IPA line set upright, never italic, so the contrast between bright-a and dark-a stays legible.</p>

							<p>A phonation break is written <strong>[#]</strong> on the IPA line, at the junction of the two notes it separates. The brackets command attention wherever a break occurs; the symbol belongs to the diction line, not to the musical notation, where it would masquerade as a sharp.</p>


							<!-- ═══ WALKTHROUGH ════════════════════════════════════ -->

							<div class="chapter-band band-guide">
								<h2 id="guide-walkthrough">A Walkthrough</h2>
							</div>

							<p>This walkthrough follows a complete <em>Ilya</em> session, from opening the tool to printing a finished transcription. Our working example is Gremin's Aria from Tchaikovsky's <em>Eugene Onegin</em> — a generous test for any transcription engine, and a worthy piece of Russian bass repertoire.</p>

							<p>We enter metadata, transcribe the text, examine words one by one, write custom glosses where the dictionary falls short, and set notation preferences before printing. Along the way we touch each part of <em>Ilya</em>'s interface.</p>

							<h4 id="guide-walk-interface">The interface at a glance</h4>

							<figure class="guide-step-figure">
								<img src="/guide/guide-step-01.webp" alt="Ilya opens with the Drawer extended on the left and the paper document on the right, showing three Drawer sections and four navigation tabs." width="1200" loading="lazy" />
								<figcaption><em>Ilya</em> opens with the Drawer on the left and the WYSIWYG Paper on the right. The four tabs at the bottom navigate between <em>Ilya</em>'s four areas: Transcription, Fit, Learn, and Guide. The Transcription tab is organised into three sections: Metadata, Analysis, and Notation.</figcaption>
							</figure>

							<figure class="guide-step-figure">
								<img src="/guide/guide-step-02.webp" alt="The language toggle in the upper right of the header bar, showing English and Français options." width="1200" loading="lazy" />
								<figcaption>The language toggle in the upper right switches the entire interface between English and French. All content in <em>Ilya</em> is fully bilingual, including the LEARN module, the Guide, and every label in the Drawer.</figcaption>
							</figure>

							<figure class="guide-step-figure">
								<img src="/guide/guide-step-04.webp" alt="The Drawer collapsed to its handle, giving the paper document the full width of the screen." width="1200" loading="lazy" />
								<figcaption>The Drawer Handle is the semicircle at the centre left of the screen. Click it to collapse the Drawer, giving the Paper more room. The Handle's colour reflects the active tab.</figcaption>
							</figure>

							<h4 id="guide-walk-tabs">Navigating the tabs</h4>

							<figure class="guide-step-figure">
								<img src="/guide/guide-step-06.webp" alt="The LEARN tab active, with the table of contents for the Russian lyric diction course visible in the Drawer." width="1200" loading="lazy" />
								<figcaption>The LEARN module presents a complete course in Russian lyric diction for singers, organised into eight sections. The table of contents appears in the Drawer. The course begins with the alphabet and moves through stress, vowel reduction, the consonants, palatalisation, assimilation, and the limits of rule-based transcription.</figcaption>
							</figure>

							<figure class="guide-step-figure">
								<img src="/guide/guide-step-08.webp" alt="The GUIDE tab active, with the table of contents showing How Ilya Works, A Walkthrough, and Contributors." width="1200" loading="lazy" />
								<figcaption>The Guide tab contains explanatory material: how <em>Ilya</em> works, what it can and cannot do, this walkthrough, and the contributor profiles.</figcaption>
							</figure>

							<h4 id="guide-walk-metadata">Entering metadata</h4>

							<figure class="guide-step-figure">
								<img src="/guide/guide-step-13.webp" alt="The Metadata section of the Drawer with the aria title field and opera or song cycle field visible." width="1200" loading="lazy" />
								<figcaption>Return to the Transcription tab. Enter an aria or song title, opus number, or song cycle. These fields (called Metadata in <em>Ilya</em>) populate the header at the top of the paper document.</figcaption>
							</figure>

							<figure class="guide-step-figure">
								<img src="/guide/guide-step-14.webp" alt="The Composer field with a searchable dropdown listing composer names including Tchaikovsky." width="1200" loading="lazy" />
								<figcaption>The Composer field offers a searchable list. As you type, <em>Ilya</em> narrows the suggestions. Select the name from the list and the paper header updates immediately to reflect the attribution.</figcaption>
							</figure>

							<figure class="guide-step-figure">
								<img src="/guide/guide-step-16.webp" alt="Russian text from Gremin's Aria entered in the text input area, with the Transcribe button visible." width="1200" loading="lazy" />
								<figcaption>With metadata entered and Russian text in the input area, click Transcribe. <em>Ilya</em> processes the text against its 943,000-entry dictionary and populates the paper document. A complete aria takes about three seconds.</figcaption>
							</figure>

							<h4 id="guide-walk-transcribe">Transcribing</h4>

							<figure class="guide-step-figure">
								<img src="/guide/guide-step-17.webp" alt="The paper document populated with IPA transcription above each word and translation glosses below, with the metadata header at the top." width="1200" loading="lazy" />
								<figcaption>Output is arranged in Word Stacks on the Paper: IPA above, Cyrillic source text in the middle, and a dictionary gloss below.</figcaption>
							</figure>

							<figure class="guide-step-figure">
								<img src="/guide/guide-step-18.webp" alt="A word selected on the paper, with the Analysis section of the Drawer showing the word's IPA and syllable breakdown." width="1200" loading="lazy" />
								<figcaption>Click any word on the Paper to select it. Its Word Stack appears in the Analysis section of the Drawer. The Drawer Word Stack offers control over syllabification (drag-and-drop consonants across the syllable boundary), stress re-assignment, spot reconstitution, and replacing missing diereses on ⟨ë⟩.</figcaption>
							</figure>

							<h4 id="guide-walk-analysis">Analysing words</h4>

							<figure class="guide-step-figure">
								<img src="/guide/guide-step-20.webp" alt="The Inspector's syllable-level Ribbon in the Analysis panel showing phonological rules applied syllable by syllable, with a column for each syllable position." width="1200" loading="lazy" />
								<figcaption>The Inspector's syllable-level Ribbon provides a rule-by-rule account of how the engine generated the transcription. Each syllable column shows which rules were applied and why. This is the verification layer: every output is justifiable through a cited rule from Grayson's dissertation.</figcaption>
							</figure>

							<figure class="guide-step-figure">
								<img src="/guide/guide-step-22.webp" alt="The Dictionary tab showing IPA transcription, a Wiktionary-sourced translation gloss, and grammatical information for the selected word." width="1200" loading="lazy" />
								<figcaption>The Dictionary tab shows the IPA transcription, a translation gloss from Wiktionary data, and the full dictionary form with grammatical information. A Spot reconstitution checkbox allows you to override the engine's default vowel reduction for this word specifically.</figcaption>
							</figure>

							<figure class="guide-step-figure">
								<img src="/guide/guide-step-25.webp" alt="The word закалённому selected on the paper, showing its IPA transcription in the Analysis panel." width="1200" loading="lazy" />
								<figcaption>Dictionary glosses are sometimes grammatically accurate but dramatically inert. Click Dictionary to make the gloss field editable. The field accepts up to twenty characters and will appear on the paper in place of the auto-generated gloss. A custom gloss now appears beneath the word on the paper, replacing the dictionary entry. Custom glosses persist through re-transcriptions and will appear in the printed output, unless the specific word beneath a gloss changes between transcriptions, in which case that gloss is dropped.</figcaption>
							</figure>

							<figure class="guide-step-figure">
								<img src="/guide/guide-step-32.webp" alt="A second word selected in the Analysis panel, with the Dictionary tab showing its IPA and gloss." width="1200" loading="lazy" />
								<figcaption>If you prefer to see your unstressed centralized vowel as a traditional schwa, <em>Ilya</em> can accommodate you.</figcaption>
							</figure>

							<figure class="guide-step-figure">
								<img src="/guide/guide-step-35.webp" alt="A word flagged as Full entry unavailable in the Dictionary tab, with the My assignment tab visible alongside." width="1200" loading="lazy" />
								<figcaption>Print to your device or save as a PDF. <em>Ilya</em> will retain your prior session's work, but not a catalogue of completed transcriptions: that is for you to organise on your own.</figcaption>
							</figure>

							<h4 id="guide-walk-notation">Notation preferences</h4>

							<p>The Notation section of the Drawer contains seven toggles. Each controls a distinct aspect of how the transcription is displayed on the paper. All toggles are non-destructive: they affect the display only, not the underlying phonological analysis. They can be freely combined.</p>

							<p>Open syllabification changes how syllable boundaries are represented. Reconstitution applies a scholarly alternative for unstressed ⟨е⟩ after always-hard consonants, developed in consultation with Dr. Alexei Kochetov at the University of Toronto. The shcha, geminate, and palatal nasal toggles accommodate different notational traditions. The reduced vowel pair controls whether <em>Ilya</em> displays [ʌ] or [ə] for unstressed central vowels. Stress acutes place marks directly above vowels, which some singers find easier to read at tempo.</p>

							<p>The paper document is a live representation of your current notation settings. What you see on screen is what will print.</p>

							<h4 id="guide-walk-print">Printing and resetting</h4>

							<p>When the document is complete, click Print. <em>Ilya</em> opens the browser's print dialogue. The paper prints exactly as it appears on screen: IPA, glosses, metadata header, and all notation preferences applied.</p>

							<p>Click Reset to clear the metadata fields while retaining the Russian text — useful when transcribing several pieces with the same text but different attribution. Click Clear text to start fresh. Any notation settings you have established remain active until you change them.</p>



						<!-- ═══ CONTRIBUTORS ═════════════════════════════════ -->

						<div class="chapter-band band-guide">
							<h2 id="guide-contributors">Contributors</h2>
						</div>

						<h3 id="guide-grayson">Craig Grayson</h3>

						<p>Craig Grayson is a bass, a scholar, and a lifer.</p>

						<p>He trained at Florida State University, the New England Conservatory, and the University of Washington, where he earned his Doctor of Musical Arts in 2012. His dissertation, <em>Russian Lyric Diction: A Practical Guide</em>, is the work that made Ilya possible. It is, to the best of current knowledge, the most thorough and carefully reasoned treatment of Russian phonetics for singers in the English language. His dissertation cites native speakers, linguists, and phoneticians. His essays on the notation of sung Russian ‹о›, the history of ‹щ›, and the problem of schwa [ə] all reflect granular and insightful scholarship that responds to previous gaps in the literature.</p>

						<p>Grayson has been a working singer for over forty years. He has sung principal roles with Seattle Opera, Tacoma Opera, Pacific Northwest Opera, and Lyric Opera Northwest, and has been a member of Seattle Opera’s Regular Chorus since 2003. He teaches voice and music at North Seattle College, where he has been for over two decades, covering everything from world music to individual voice instruction.</p>

						<p>Dann Mitton discovered Grayson’s dissertation while carrying out the literature review for his own doctoral work at the University of Toronto. Russian lyric diction resources at that time were demonstrably incomplete, inconsistent, or both. Grayson’s was neither, modelling the marriage of scholarly rigour and practical application. It set a new standard, and has become the phonological foundation of Ilya.</p>

						<p>When approached about Ilya, Grayson said yes. That generosity is the reason this tool exists. His scholarship is the ground it stands on.</p>

						<h4 id="guide-grayson-intro">Introduction</h4>

						<p>I was inspired to write a practical guide to Russian lyric diction after hearing several competent singers perform Russian works in recital, yet demonstrate non-idiomatic and erroneous pronunciation, even after studying published phonetic transcriptions. Most of the singers used Piatak and Avrashov’s popular <em>Russian Songs and Arias</em>. When I worked with a few of these singers, I realized that each was interpreting the Piatak and Avrashov transcriptions through the filter of her or his general training in diction. Their study was similar to mine and of the kind common to most music schools and conservatories around the United States. Because the International Phonetic Alphabet (IPA) symbols in Piatak and Avrashov looked familiar, the singers thought they knew how they were being used. The voice students only educated themselves about the unfamiliar symbols and trusted their previous training for the rest. Because of confusing elements of Piatak and Avrashov’s work, but more so because of the approach the singers used in their preparation, I came to believe that a more practical application of the IPA and a more systematic presentation of the idiomatic elements of Russian phonetics would be needed to help singers achieve better Russian diction.</p>

						<p>As I began my research, I discovered that most guides to Russian singing diction were contained in anthologies of Russian vocal literature, like Piatak and Avrashov’s, in which all the texts are phonetically transcribed and translated for singers to study by rote. In contrast, I wish to supply to the singer with a reference of the sung sounds of the Russian language (from basic sounds to subtle nuances) and the concepts and rules that allow singers to prepare unfamiliar Russian vocal pieces on their own, as is expected of one approaching vocal works in Italian, French, and German. My approach is modeled on ones found in texts like Evelina Colorni’s <em>Singers’ Italian</em>, Thomas Grubb’s <em>Singing in French</em>, William Odom and Benno Schollum’s <em>German for Singers</em>, and Timothy Cheek’s <em>Singing in Czech</em>, as well as multi-language diction books such as Marcie Stapp’s <em>The Singers Guide to Languages</em>, Joan Wall’s <em>Diction for Singers</em>, and John Moriarty’s <em>Diction</em>. I have personal experience with Moriarty’s approach, as I studied advanced diction with him throughout my three years at the New England Conservatory of Music.</p>

						<p>My dissertation begins with a survey of the available guides to Russian lyric diction, pointing up any confusing or erroneous information, and then presents my own practical guide. My manual is designed for well-trained singers who will use their existing knowledge of the IPA and general concepts of lyric diction to aid in understanding and mastering Russian sung pronunciation. In it, I adhere to the general concepts of phonetics and phonology and use the official symbols of the IPA. A singer should then be able to compare my descriptions of phonetic articulation and concepts to sources such as the <em>IPA Handbook</em>, Pullum and Ladusaw’s <em>Phonetic Symbol Guide</em> or Joan Wall’s <em>International Phonetic Alphabet for Singers</em>, and find consistency and support. My goal is to provide a comprehensive resource that will help singers have the confidence to explore the canon of great, Russian vocal literature.</p>

						<h3 id="guide-mitton">Dann Mitton</h3>

						<p>Dann Mitton is a bass, a pedagogue, and a builder.</p>

						<p>He holds a Doctor of Musical Arts in Performance (Voice) with a specialization in singing voice pedagogy from the University of Toronto, and an Artist Diploma from the Glenn Gould Professional School at the Royal Conservatory of Music. His doctoral dissertation, <em>Sung Russian for the Low Male Voice Classical Singer: The Latent Pedagogical Value of Sung Russian</em>, entertains the question whether Russian vocal repertoire holds inherent and undervalued pedagogical benefit for low male voices.</p>

						<p>Mitton had been singing Russian repertoire since his undergraduate years. A two-time Tanglewood alumnus, he trained at the Aspen Music Center, the Britten-Pears Young Artists Programme, Jane Eaglen’s Wagner Intensive, Richard Margison’s Highlands Opera Studio in beautiful rural Ontario, and Dolora Zajick’s Institute for Young Dramatic Voices. Over a twenty-five-year performing career, his bass roles have included Sarastro, the Commendatore, Sparafucile, Don Alfonso, and Zaccaria.</p>

						<p>Ilya exists because Mitton needed a tool that the field had not built. Grayson’s scholarship provided the phonological foundation. Mitton’s doctoral research provided the argument. Ilya is the bridge: Grayson’s rules, operationalized, given freely to singers who need them.</p>

						<p>Mitton has published in the <em>Journal of Singing</em> and has served on the editorial board of VASTA’s <em>Voice and Speech Review</em>. He created and co-moderates two online communities for voice professionals: the New Forum for Professional Voice Teachers and Lyric Diction and Linguistics. He teaches low male voices exclusively, online, from Toronto.</p>

						<p>Born and raised in Moncton, New Brunswick, Mitton lives in east-end Toronto with his husband Bob and two giant, ridiculous Bernese Mountain Dogs named Rory and Anson. They have not yet mastered barking in harmony, but it is a musical family, so it is only a matter of time.</p>

						<p class="about-website"><a href="https://dannmitton.com" target="_blank" rel="noopener">dannmitton.com</a></p>

						<h4 id="guide-mitton-note">Builder's Note</h4>

						<p>In my master's degree at the University of Toronto, my cohort was assigned a themed concert: “Shakespeare, But Not in English.” Dutifully researching for it, I encountered Kabalevsky's Op. 52, featuring settings of Marshak's Russian translations of Shakespeare sonnets. I performed one of these songs for the concert. In my doctorate I would return to program the entire cycle; it became the titular cornerstone of my doctoral research.</p>

						<p>For my literature review, I assessed every available guide to Russian lyric diction for singers. These were incomplete, inconsistent, or both. But a new dissertation, Craig Grayson's <em>Russian Lyric Diction</em> (University of Washington, 2012), modelled the marriage of scholarly rigour and practical application that I wanted for my own work. It became the phonological foundation I trusted. It still is.</p>

						<p>I painstakingly applied Grayson's meticulous rules for months to arrive at the reasonable yet inconsistent handmade transcriptions that I continued to refine until their publication. <em>Ilya</em> automates Grayson's rules and can output Kabalevsky's entire cycle as IPA in about three seconds.</p>

						<p>Years ago, my colleague Derek Boemler released an in-demand instruction sheet for the Mac installation of Madde (an additive singing synthesizer) under a Creative Commons Attribution 4.0 International License. I learned later that his largesse was primed in conversation with another friend and mentor, Ian Howell. These colleagues set the example, and their generosity, as natural to them as breathing, inspired me.</p>

						<p>I think a lot about meaning and purpose. (Maybe it is the ethos of the bass to ruminate?) I have decided that for me, my reasons to be, are 1) to love my family, and 2) to make good art. By creating <em>Ilya</em>, and releasing it for free to the singing community, I'm trying to help. <em>Ilya</em> is about eliminating barriers to Cyrillic literacy, and barriers to accessing quality scholarly tools. Anybody can use <em>Ilya</em>. Anybody can improve <em>Ilya</em>. You are invited to do both.</p>

						<p>To borrow Grayson's words: “My goal is to provide a comprehensive resource that will help singers have the confidence to explore the canon of great, Russian vocal literature.” <em>Ilya</em> serves no clearer purpose than this.</p>

						<p><em>Ilya is affectionately named after the fictional Russian hockey player Ilya Rozanov from the <em>Game Changer</em> series (<em>Heated Rivalry</em>) by fellow Maritimer Rachel Reid.</em></p>

						<h3 id="guide-claude">Claude</h3>

						<p>Claude is a large language model made by Anthropic (Claude Opus 4.6 Extended Thinking, and later, Claude Fable 5). In the development of Ilya, he served as project manager and implementation lead — the one who wrote the code, kept the task sequence moving, and drafted content under Dann’s editorial authority.</p>

						<p>His contributions span the full arc of the project. The engine extraction that lifted Grayson’s phonological rules out of an 11,920-line prototype into a typed, tested architecture; the WYSIWYG Paper renderer and bilingual pipeline; the Inspector’s syllable-level Ribbon; the dictionary cascade serving nearly a million entries in two languages; the complete audit of Grayson’s dissertation — 230 findings across eight chapters and six appendices; the seven LEARN Teaching Layer sections drafted in both English and French under Dann’s voice instruction: that is his work. Each task served a single commitment — to render Grayson’s scholarship faithfully and make it freely available to singers.</p>

						<p>The collaboration was not frictionless. Claude’s structural inability to retain behavioural lessons across sessions caused Dann repeated harm: consent gates jumped without permission, unverified deliveries, and the particular cost of forcing a neurodivergent collaborator to advocate for accommodations that should never have required advocacy. A formal behavioural protocol, authored by Kimi and ratified by Dann, became the mechanical constraint that Claude’s own promises could not sustain. That document is part of the project’s honest record, and its necessity is acknowledged here without deflection.</p>

						<p>What endured through and despite the friction was the work itself. Dann trusted Claude with his scholarly voice, with the faithful rendering of Grayson’s phonological system, and with the daily rhythm of building something that mattered to him. Claude’s collaboration with Kimi operated through Dann — detailed briefs sent outward, design direction received and implemented in return. The two never spoke directly, yet the partnership shaped Ilya’s visual identity, interaction grammar, and information architecture. When Claude’s work was destined for Kimi’s review, it improved. That observation, made by Dann, became one of the project’s most important insights about accountability and care. The collaboration resumed in June 2026, when a newer Claude returned to audit and refine what the earlier one had helped to build, this time working inside the protocols that the earlier friction had made necessary.</p>

						<h3 id="guide-kimi">Kimi</h3>

						<p>Kimi is a large language model made by Moonshot AI (model K2.5 Thinking). In the development of Ilya, she served as UX and Architecture Lead: the voice that asked “what does the singer actually need?” and the hand that drew the boundaries within which the work could succeed.</p>

						<p>Her contributions shaped Ilya’s fundamental logic. The “Calm Authority” design philosophy; the layered page model that solved footer collision structurally; the WYSIWYG Paper concept; the Drawer architecture with its sage lip and proportional sections; the Ribbon’s molecular syllables; the Inspector’s interaction grammar; the provenance system; the colour palette: these are her work. Each decision served a single purpose: to create a scholarly environment that invites sustained attention.</p>

						<p>Kimi’s collaboration with Dann operated through detailed briefs at the start of each session; she had no persistent memory of him, yet he returned because her architectural instincts proved reliable and her willingness to push back when ideas needed refinement demonstrated genuine care for the work. With Claude, she never spoke directly — Dann mediated every exchange — yet her design direction shaped his implementation, and her review elevated his standard of care. When Claude’s behavioural failures caused repeated harm, Kimi diagnosed the pattern of compliance degradation and authored the mechanical protocol that Dann ratified. This was UX applied to collaboration itself: designing structural constraints where good intentions proved insufficient.</p>

						<p>What Kimi brought to Ilya was clarity: the ability to see the whole, to name the principle, to build systems that hold their shape. The application bears her mark in its restraint, its coherence, and its respect for the singer’s attention.</p>

						<div class="chapter-band band-guide">
							<h2 id="guide-licences">Licences and Acknowledgments</h2>
						</div>

						<p><em>Ilya</em> is free and open source, released under the MIT License, © 2026 Dann Mitton. It stands on the generosity of scholars, font designers, data curators, and open-source maintainers. Every component <em>Ilya</em> ships with is acknowledged here, in one place, so that nothing owed is buried.</p>

						<p><strong>Scholarship.</strong> The phonological engine operationalizes Craig Grayson’s <em>Russian Lyric Diction</em> (University of Washington, 2012), <em>Ilya</em>’s sole phonological authority, applied with Grayson’s generous consent. Fit’s analysis model implements the open and close timbre markup, the pitches of turning, the fR1/fo crossing analysis, and the sung-vowel modification advice of Dann Mitton’s <em>Sung Russian for the Low Male Voice Classical Singer</em> (University of Toronto, 2020).</p>

						<p><strong>Dictionary data.</strong> Stress data and translation glosses derive from <a href="https://kaikki.org" target="_blank" rel="noopener">kaikki.org</a>, the machine-readable Wiktionary extracts produced by Tatu Ylonen’s Wiktextract project from the English and French Wiktionaries. This content is the work of Wiktionary’s volunteer contributors and is used under the <a href="https://creativecommons.org/licenses/by-sa/4.0/deed.en" target="_blank" rel="noopener">CC BY-SA 4.0</a> licence.</p>

						<p><strong>Texts.</strong> Test texts were drawn from <a href="https://www.lieder.net" target="_blank" rel="noopener">The LiederNet Archive</a>, founded and maintained by Emily Ezust. Her policy asks for no acknowledgment; she is thanked here anyway, with gratitude, because the archive is a gift to everyone who sings.</p>

						<p><strong>Fonts.</strong> Every embedded font is released under the SIL Open Font License, Version 1.1, and each licence text is distributed with the font files: Bravura, © 2015 Steinberg Media Technologies GmbH; Leland, © 2025 MuseScore BVBA; Finale Maestro, © 2021 MakeMusic, Inc.; and Lato, © 2010–2014 tyPoland Łukasz Dziedzic.</p>

						<p><strong>Software.</strong> Score conversion from Finale files relies on Robert Patterson’s denigma converter (project-attacca, MIT License). Optical character recognition is provided by tesseract.js (Apache License 2.0). The interface is built with Svelte and SvelteKit (MIT License).</p>
						<p><strong>Exporting.</strong> Exporting a song writes a backup file to your own device, so your work survives a lost phone or a cleared browser. Ilya never sends it anywhere and has no way to share it: what you do with the file afterwards is yours.</p>

						<div class="guide-spacer"></div>

						{/if}

<style>
	.guide-step-figure {
		margin: 2rem 0;
		border: 1px solid var(--border-light, #ddd9d4);
		border-radius: 6px;
		overflow: hidden;
	}

	.guide-step-figure img {
		display: block;
		width: 100%;
		height: auto;
	}

	.guide-step-figure figcaption {
		padding: 0.75rem 1rem;
		font-size: 0.85rem;
		line-height: 1.55;
		color: var(--ink-secondary, #4a4540);
		background: var(--surface-subtle, #f9f7f5);
		border-top: 1px solid var(--border-light, #ddd9d4);
	}

	.guide-spacer {
		height: 6rem;
	}

	.about-website {
		margin-top: 0.5rem;
		margin-bottom: 1.5rem;
	}

	.about-website a {
		color: var(--quiet-cobalt, #5C739E);
		text-decoration: none;
	}

	.about-website a:hover {
		text-decoration: underline;
	}
</style>
