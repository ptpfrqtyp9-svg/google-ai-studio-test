import SwiftUI

#if canImport(UIKit)
import UIKit
#endif

// MARK: - Curated Symbol Categories

public enum SFSymbolCategory: String, CaseIterable, Identifiable {
    case creaturesAndNature = "Creatures & Nature"
    case vehiclesAndSpeed = "Vehicles & Speed"
    case gamingAndFun = "Gaming & Fun"
    case sportsAndGeometry = "Sports & Geometry"
    
    public var id: String { rawValue }
    
    public var iconName: String {
        switch self {
        case .creaturesAndNature: return "leaf.fill"
        case .vehiclesAndSpeed: return "rocket.fill"
        case .gamingAndFun: return "gamecontroller.fill"
        case .sportsAndGeometry: return "trophy.fill"
        }
    }
    
    public var subtitle: String {
        switch self {
        case .creaturesAndNature: return "Fauna, flora, celestial bodies & atmospheric weather"
        case .vehiclesAndSpeed: return "Aircraft, automobiles, vessels, transit & speed"
        case .gamingAndFun: return "Consoles, media, instruments, magic & play"
        case .sportsAndGeometry: return "Athletics, awards, badges, tools & iconic geometry"
        }
    }
}

// MARK: - Curated SF Symbols Matrix & Automated Pattern Generator Engine

public struct SFSymbolCatalogEngine {
    
    // MARK: 1. Explicit Curated Seed Matrix (High-Interest & Trace-Ready)
    
    public static let creaturesAndNatureSeeds: [String] = [
        "pawprint.fill",
        "hare.fill",
        "tortoise.fill",
        "bird.fill",
        "fish.fill",
        "ant.fill",
        "ladybug.fill",
        "butterfly.fill",
        "leaf.fill",
        "tree.fill",
        "flame.fill",
        "sun.max.fill",
        "moon.stars.fill",
        "cloud.bolt.rain.fill",
        "sparkles",
        "fossil.shell.fill"
    ]
    
    public static let vehiclesAndSpeedSeeds: [String] = [
        "car.fill",
        "car.side.fill",
        "truck.box.fill",
        "airplane",
        "bicycle",
        "scooter",
        "tram.fill",
        "sailboat.fill",
        "rocket.fill",
        "helicopter.fill",
        "motorcycle.fill"
    ]
    
    public static let gamingAndFunSeeds: [String] = [
        "gamecontroller.fill",
        "tv.fill",
        "headphones",
        "guitar.fill",
        "book.fill",
        "paintbrush.filled.hover.button.shape",
        "lightbulb.fill",
        "binoculars.fill",
        "dice.fill",
        "puzzlepiece.fill",
        "theatermasks.fill",
        "crown.fill"
    ]
    
    public static let sportsAndGeometrySeeds: [String] = [
        "soccerball",
        "basketball.fill",
        "trophy.fill",
        "medal.fill",
        "umbrella.fill",
        "key.fill",
        "gift.fill",
        "hourglass",
        "shield.fill",
        "waveform.path"
    ]
    
    // MARK: - Boring UI Filter Rule
    // Explicitly filters out boring UI controls like arrows, clipboards, checkboxes, or gears
    public static func isBoringOrExcludedUI(_ name: String) -> Bool {
        let boringPrefixes = [
            "arrow", "chevron", "gear", "slider", "list.", "text.", "line.horizontal",
            "checkmark", "xmark", "multiply", "divide", "plus", "minus", "equal",
            "doc.", "clipboard", "tray", "archivebox", "externaldrive", "internaldrive",
            "network", "server", "terminal", "switch.", "point."
        ]
        
        for prefix in boringPrefixes {
            if name.hasPrefix(prefix) {
                return true
            }
        }
        
        let exactBoringSymbols: Set<String> = [
            "ellipsis", "ellipsis.circle", "ellipsis.rectangle",
            "info", "info.circle", "info.circle.fill",
            "questionmark", "questionmark.circle", "exclamationmark",
            "square.and.arrow.up", "square.and.arrow.down", "pencil.circle"
        ]
        
        return exactBoringSymbols.contains(name)
    }
    
    // MARK: - Automated Pattern Generator (Expands into Hundreds of Validated Symbols)
    
    public static func generateFullCatalog() -> [SFSymbolCategory: [String]] {
        var catalog: [SFSymbolCategory: [String]] = [:]
        
        // Helper to validate whether symbol actually exists on iOS system
        func isValidSymbol(_ name: String) -> Bool {
            if isBoringOrExcludedUI(name) { return false }
            #if canImport(UIKit)
            return UIImage(systemName: name) != nil
            #else
            return true
            #endif
        }
        
        // Helper to append unique valid candidates
        func appendUnique(to list: inout [String], candidate: String) {
            if isValidSymbol(candidate) && !list.contains(candidate) {
                list.append(candidate)
            }
        }
        
        // -------------------------------------------------------------
        // CATEGORY 1: CREATURES & NATURE
        // -------------------------------------------------------------
        var creaturesList: [String] = []
        for seed in creaturesAndNatureSeeds {
            appendUnique(to: &creaturesList, candidate: seed)
        }
        
        // Programmatic Weather & Celestial Matrix
        let weatherConditions = [
            "sun.max.fill", "sun.min.fill", "sun.horizon.fill", "sun.dust.fill", "sun.haze.fill", "sun.rain.fill", "sun.snow.fill",
            "moon.fill", "moon.circle.fill", "moon.stars.fill", "moon.zzz.fill",
            "cloud.fill", "cloud.drizzle.fill", "cloud.rain.fill", "cloud.heavyrain.fill", "cloud.fog.fill", "cloud.hail.fill",
            "cloud.snow.fill", "cloud.sleet.fill", "cloud.bolt.fill", "cloud.bolt.rain.fill",
            "cloud.sun.fill", "cloud.sun.rain.fill", "cloud.sun.bolt.fill",
            "cloud.moon.fill", "cloud.moon.rain.fill", "cloud.moon.bolt.fill",
            "wind", "wind.snow", "snowflake", "rainbow"
        ]
        for w in weatherConditions {
            appendUnique(to: &creaturesList, candidate: w)
        }
        
        // Natural & Fauna variations (Circles & Embellishments)
        let natureBases = ["leaf", "tree", "pawprint", "hare", "tortoise", "fish", "bird", "flame", "drop"]
        for base in natureBases {
            appendUnique(to: &creaturesList, candidate: "\(base).fill")
            appendUnique(to: &creaturesList, candidate: "\(base).circle.fill")
        }
        
        let additionalFaunaAndFlora = [
            "feather", "camera.macro", "water.waves", "tropicalstorm",
            "volcano.fill", "mountain.2.fill", "globe.americas.fill",
            "globe.europe.africa.fill", "globe.asia.australia.fill"
        ]
        for item in additionalFaunaAndFlora {
            appendUnique(to: &creaturesList, candidate: item)
        }
        catalog[.creaturesAndNature] = creaturesList
        
        // -------------------------------------------------------------
        // CATEGORY 2: VEHICLES & SPEED
        // -------------------------------------------------------------
        var vehiclesList: [String] = []
        for seed in vehiclesAndSpeedSeeds {
            appendUnique(to: &vehiclesList, candidate: seed)
        }
        
        // Transit variations and circular variations
        let vehicleBases = ["car", "airplane", "bicycle", "tram", "sailboat", "scooter"]
        for base in vehicleBases {
            appendUnique(to: &vehiclesList, candidate: "\(base).circle.fill")
        }
        
        let additionalVehicles = [
            "car.2.fill", "car.front.waves.up.fill", "bus.fill", "bus.doubledecker.fill",
            "tram.tunnel.fill", "train.side.front.car", "cablecar.fill", "ferry.fill",
            "airplane.departure", "airplane.arrival", "steeringwheel", "fuelpump.fill",
            "road.lanes", "engine.combustion.fill", "headlight.high.beam.fill", "speedometer"
        ]
        for v in additionalVehicles {
            appendUnique(to: &vehiclesList, candidate: v)
        }
        catalog[.vehiclesAndSpeed] = vehiclesList
        
        // -------------------------------------------------------------
        // CATEGORY 3: GAMING & FUN
        // -------------------------------------------------------------
        var gamingList: [String] = []
        for seed in gamingAndFunSeeds {
            appendUnique(to: &gamingList, candidate: seed)
        }
        
        // Programmatic Dice Matrix: die.face.1.fill ... die.face.6.fill
        for face in 1...6 {
            appendUnique(to: &gamingList, candidate: "die.face.\(face).fill")
        }
        
        // Programmatic Card Suit Matrix
        let cardSuits = ["suit.heart.fill", "suit.club.fill", "suit.diamond.fill", "suit.spade.fill"]
        for suit in cardSuits {
            appendUnique(to: &gamingList, candidate: suit)
        }
        
        // Circular variations of entertainment bases
        let funBases = ["gamecontroller", "tv", "headphones", "book", "crown", "lightbulb"]
        for base in funBases {
            appendUnique(to: &gamingList, candidate: "\(base).circle.fill")
        }
        
        let creativeAndMedia = [
            "paintbrush.fill", "paintpalette.fill", "wand.and.stars", "pianokeys.fill",
            "guitars.fill", "music.note", "music.quarternote.3", "music.mic", "radio.fill",
            "camera.fill", "film.fill", "popcorn.fill", "party.popper.fill",
            "balloon.fill", "balloon.2.fill", "arcade.stick.console.fill", "puzzlepiece.extension.fill"
        ]
        for item in creativeAndMedia {
            appendUnique(to: &gamingList, candidate: item)
        }
        catalog[.gamingAndFun] = gamingList
        
        // -------------------------------------------------------------
        // CATEGORY 4: SPORTS & GEOMETRY
        // -------------------------------------------------------------
        var sportsList: [String] = []
        for seed in sportsAndGeometrySeeds {
            appendUnique(to: &sportsList, candidate: seed)
        }
        
        // Athletic Sports Figures
        let athleticFigures = [
            "figure.run", "figure.walk", "figure.pool.swim", "figure.outdoor.cycle",
            "figure.snowboarding", "figure.skiing.downhill", "figure.boxing", "figure.tennis",
            "figure.cricket", "figure.golf", "figure.archery", "figure.fencing",
            "figure.rower", "figure.bowling", "figure.skateboarding", "figure.surfing",
            "figure.baseball", "figure.badminton", "figure.volleyball", "figure.strengthtraining.traditional"
        ]
        for figure in athleticFigures {
            appendUnique(to: &sportsList, candidate: figure)
        }
        
        // Equipment & Balls
        let sportsEquipment = [
            "baseball.fill", "tennisball.fill", "volleyball.fill", "cricket.ball.fill",
            "flag.checkered.2.crossed", "target", "skateboard.fill"
        ]
        for eq in sportsEquipment {
            appendUnique(to: &sportsList, candidate: eq)
        }
        
        // Programmatic Geometric Bases with .circle.fill and .square.fill
        let geometricBases = [
            "shield", "star", "heart", "bolt", "bell", "tag", "flag",
            "key", "gift", "hourglass", "diamond", "hexagon", "seal", "triangle", "cross"
        ]
        for base in geometricBases {
            appendUnique(to: &sportsList, candidate: "\(base).fill")
            appendUnique(to: &sportsList, candidate: "\(base).circle.fill")
            appendUnique(to: &sportsList, candidate: "\(base).square.fill")
        }
        catalog[.sportsAndGeometry] = sportsList
        
        return catalog
    }
}

// MARK: - SF Symbols Library Grid View Component

public struct SFSymbolsLibraryView: View {
    @Binding public var selectedSymbolName: String?
    public var onSelectSymbol: ((String) -> Void)?
    
    @State private var catalog: [SFSymbolCategory: [String]] = [:]
    @State private var selectedCategoryFilter: SFSymbolCategory? = nil
    @State private var searchQuery: String = ""
    @Environment(\.dismiss) private var dismiss
    
    // Grid layout: adaptive square tiles
    private let columns = [
        GridItem(.adaptive(minimum: 84, maximum: 104), spacing: 12)
    ]
    
    public init(
        selectedSymbolName: Binding<String?>,
        onSelectSymbol: ((String) -> Void)? = nil
    ) {
        self._selectedSymbolName = selectedSymbolName
        self.onSelectSymbol = onSelectSymbol
    }
    
    public var body: some View {
        NavigationStack {
            ZStack {
                // Dark-Mode Studio Slate Background
                Color(red: 0.08, green: 0.08, blue: 0.10)
                    .ignoresSafeArea()
                
                VStack(spacing: 0) {
                    // Header Subtitle & Quick Stats Bar
                    headerBar
                    
                    // Search & Category Filter Pills
                    filterPillsBar
                    
                    // Scrolling Grid of Curated Categories
                    ScrollView {
                        LazyVStack(alignment: .leading, spacing: 28) {
                            ForEach(displayCategories) { category in
                                let symbols = filteredSymbols(for: category)
                                if !symbols.isEmpty {
                                    VStack(alignment: .leading, spacing: 14) {
                                        // Markdown Header for Category
                                        categoryHeader(category, count: symbols.count)
                                        
                                        // LazyVGrid of Square Dark-Mode Tile Cards
                                        LazyVGrid(columns: columns, spacing: 12) {
                                            ForEach(symbols, id: \.self) { symbol in
                                                symbolTileCard(symbol: symbol)
                                            }
                                        }
                                    }
                                }
                            }
                        }
                        .padding(.horizontal, 18)
                        .padding(.top, 16)
                        .padding(.bottom, 40)
                    }
                }
            }
            .navigationTitle("SF Symbols Library")
            .navigationBarTitleDisplayMode(.inline)
            .toolbar {
                ToolbarItem(placement: .topBarTrailing) {
                    Button(action: {
                        dismiss()
                    }) {
                        Image(systemName: "xmark.circle.fill")
                            .font(.system(size: 20))
                            .foregroundColor(.gray)
                    }
                }
            }
        }
        .preferredColorScheme(.dark)
        .onAppear {
            if catalog.isEmpty {
                catalog = SFSymbolCatalogEngine.generateFullCatalog()
            }
        }
    }
    
    // MARK: - Subviews
    
    private var totalSymbolCount: Int {
        catalog.values.reduce(0) { $0 + $1.count }
    }
    
    private var displayCategories: [SFSymbolCategory] {
        if let selected = selectedCategoryFilter {
            return [selected]
        }
        return SFSymbolCategory.allCases
    }
    
    private func filteredSymbols(for category: SFSymbolCategory) -> [String] {
        let baseList = catalog[category] ?? []
        let query = searchQuery.trimmingCharacters(in: .whitespacesAndNewlines).lowercased()
        if query.isEmpty {
            return baseList
        }
        return baseList.filter { $0.lowercased().contains(query) }
    }
    
    // MARK: Header Bar
    private var headerBar: some View {
        HStack {
            VStack(alignment: .leading, spacing: 2) {
                Text("Trace-Ready Vector Blueprints")
                    .font(.system(size: 13, weight: .semibold))
                    .foregroundColor(.white)
                Text("Hundreds of fun, trace-optimized Apple SF Symbols")
                    .font(.system(size: 11, weight: .medium))
                    .foregroundColor(.gray)
            }
            
            Spacer()
            
            // Badge Counter Pill
            HStack(spacing: 4) {
                Image(systemName: "sparkles")
                    .font(.system(size: 10, weight: .bold))
                Text("\(totalSymbolCount) Shapes")
                    .font(.system(size: 11, weight: .bold))
            }
            .foregroundColor(.cyan)
            .padding(.horizontal, 10)
            .padding(.vertical, 5)
            .background(Color.cyan.opacity(0.15))
            .clipShape(Capsule())
            .overlay(
                Capsule()
                    .stroke(Color.cyan.opacity(0.3), lineWidth: 1)
            )
        }
        .padding(.horizontal, 18)
        .padding(.top, 12)
        .padding(.bottom, 10)
    }
    
    // MARK: Filter & Search Bar
    private var filterPillsBar: some View {
        VStack(spacing: 10) {
            // Search Field
            HStack(spacing: 8) {
                Image(systemName: "magnifyingglass")
                    .font(.system(size: 13, weight: .medium))
                    .foregroundColor(.gray)
                TextField("Search by shape or concept...", text: $searchQuery)
                    .font(.system(size: 13))
                    .foregroundColor(.white)
                    .autocorrectionDisabled()
                if !searchQuery.isEmpty {
                    Button(action: { searchQuery = "" }) {
                        Image(systemName: "xmark.circle.fill")
                            .font(.system(size: 14))
                            .foregroundColor(.gray)
                    }
                }
            }
            .padding(.horizontal, 12)
            .padding(.vertical, 8)
            .background(Color(red: 0.14, green: 0.14, blue: 0.16))
            .clipShape(RoundedRectangle(cornerRadius: 12, style: .continuous))
            .overlay(
                RoundedRectangle(cornerRadius: 12, style: .continuous)
                    .stroke(Color.white.opacity(0.1), lineWidth: 1)
            )
            .padding(.horizontal, 18)
            
            // Horizontal Scrollable Category Filter Pills
            ScrollView(.horizontal, showsIndicators: false) {
                HStack(spacing: 8) {
                    // All Pill
                    Button(action: {
                        withAnimation(.easeInOut(duration: 0.2)) {
                            selectedCategoryFilter = nil
                        }
                    }) {
                        HStack(spacing: 5) {
                            Image(systemName: "square.grid.2x2.fill")
                                .font(.system(size: 11))
                            Text("All (\(totalSymbolCount))")
                                .font(.system(size: 12, weight: .semibold))
                        }
                        .padding(.horizontal, 12)
                        .padding(.vertical, 6)
                        .background(selectedCategoryFilter == nil ? Color.cyan : Color.white.opacity(0.08))
                        .foregroundColor(selectedCategoryFilter == nil ? .black : .white)
                        .clipShape(Capsule())
                    }
                    
                    // Category Specific Pills
                    ForEach(SFSymbolCategory.allCases) { category in
                        let isSelected = selectedCategoryFilter == category
                        let count = catalog[category]?.count ?? 0
                        
                        Button(action: {
                            withAnimation(.easeInOut(duration: 0.2)) {
                                selectedCategoryFilter = category
                            }
                        }) {
                            HStack(spacing: 5) {
                                Image(systemName: category.iconName)
                                    .font(.system(size: 11))
                                Text("\(category.rawValue) (\(count))")
                                    .font(.system(size: 12, weight: .semibold))
                            }
                            .padding(.horizontal, 12)
                            .padding(.vertical, 6)
                            .background(isSelected ? Color.cyan : Color.white.opacity(0.08))
                            .foregroundColor(isSelected ? .black : .white)
                            .clipShape(Capsule())
                        }
                    }
                }
                .padding(.horizontal, 18)
            }
        }
        .padding(.bottom, 6)
    }
    
    // MARK: Category Header
    private func categoryHeader(_ category: SFSymbolCategory, count: Int) -> some View {
        VStack(alignment: .leading, spacing: 4) {
            HStack(spacing: 8) {
                Image(systemName: category.iconName)
                    .font(.system(size: 14, weight: .bold))
                    .foregroundColor(.cyan)
                
                // Elegant Markdown Title for Category
                Text("**\(category.rawValue.uppercased())**")
                    .font(.system(size: 14, weight: .heavy, design: .rounded))
                    .tracking(0.8)
                    .foregroundColor(.white)
                
                Spacer()
                
                Text("\(count) items")
                    .font(.system(size: 11, weight: .semibold, design: .monospaced))
                    .foregroundColor(.gray)
            }
            
            Text(category.subtitle)
                .font(.system(size: 11, weight: .regular))
                .foregroundColor(.gray.opacity(0.8))
        }
        .padding(.top, 4)
    }
    
    // MARK: Dark-Mode Square Grid Tile Card
    // Using .font(.system(size: 36)) as explicitly requested
    private func symbolTileCard(symbol: String) -> some View {
        let isSelected = selectedSymbolName == symbol
        
        return Button(action: {
            selectedSymbolName = symbol
            onSelectSymbol?(symbol)
            dismiss()
        }) {
            VStack(spacing: 6) {
                ZStack {
                    // Dark Mode Tile Card Surface
                    RoundedRectangle(cornerRadius: 18, style: .continuous)
                        .fill(isSelected ? Color.cyan.opacity(0.18) : Color(red: 0.13, green: 0.13, blue: 0.16))
                        .overlay(
                            RoundedRectangle(cornerRadius: 18, style: .continuous)
                                .stroke(
                                    isSelected ? Color.cyan : Color.white.opacity(0.10),
                                    lineWidth: isSelected ? 2.0 : 1.0
                                )
                        )
                        .shadow(color: isSelected ? Color.cyan.opacity(0.25) : Color.black.opacity(0.2), radius: 6, y: 3)
                    
                    // Centered SF Symbol with 36pt font size
                    Image(systemName: symbol)
                        .font(.system(size: 36, weight: .medium))
                        .foregroundColor(isSelected ? .cyan : .white.opacity(0.92))
                        .frame(maxWidth: .infinity, maxHeight: .infinity)
                    
                    // Selected Checkmark Pill Overlay
                    if isSelected {
                        VStack {
                            HStack {
                                Spacer()
                                Image(systemName: "checkmark.circle.fill")
                                    .font(.system(size: 14, weight: .bold))
                                    .foregroundColor(.cyan)
                                    .background(Color.black.clipShape(Circle()))
                                    .padding(6)
                            }
                            Spacer()
                        }
                    }
                }
                .frame(height: 84)
                
                // Human-readable clean short name
                Text(cleanSymbolLabel(symbol))
                    .font(.system(size: 10, weight: .medium))
                    .foregroundColor(isSelected ? .cyan : .gray)
                    .lineLimit(1)
                    .truncationMode(.tail)
                    .padding(.horizontal, 2)
            }
        }
        .buttonStyle(TilePressButtonStyle())
    }
    
    private func cleanSymbolLabel(_ name: String) -> String {
        name.replacingOccurrences(of: ".fill", with: "")
            .replacingOccurrences(of: ".circle", with: " (circ)")
            .replacingOccurrences(of: ".square", with: " (sq)")
            .replacingOccurrences(of: ".", with: " ")
    }
}

// MARK: - Spring Touch Animation Style

public struct TilePressButtonStyle: ButtonStyle {
    public func makeBody(configuration: Configuration) -> some View {
        configuration.label
            .scaleEffect(configuration.isPressed ? 0.93 : 1.0)
            .animation(.spring(response: 0.25, dampingFraction: 0.7), value: configuration.isPressed)
    }
}

// MARK: - Preview

#Preview {
    SFSymbolsLibraryView(
        selectedSymbolName: .constant("gamecontroller.fill")
    )
}
