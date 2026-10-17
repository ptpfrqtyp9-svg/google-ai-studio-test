import SwiftUI

// MARK: - Color & Tool Sidebar (matches the reference design)
//
// Left: a rack of brush swatches (one per palette color).
// Right: a blue column with four tool cards.
// Top/bottom: orange "clear" and red "save" squircle buttons.
// Visual design follows the web app's ColorSidebar.tsx; behavior mirrors the bottom toolbar
// (tapping a color selects it and switches to the brush; tapping a tool card selects that tool).

// MARK: Palette (same 18 colors as the web sidebar)

private enum SidebarPalette {
    static let colors: [Color] = [
        Color(hex: 0xF9A8D4), // Baby Pink
        Color(hex: 0xEC4899), // Hot Magenta
        Color(hex: 0xE11D48), // Berry Rose
        Color(hex: 0xC084FC), // Soft Mauve
        Color(hex: 0xFB7185), // Coral Salmon
        Color(hex: 0xDC2626), // Crimson Red
        Color(hex: 0xEA580C), // Terracotta
        Color(hex: 0x881337), // Deep Burgundy
        Color(hex: 0x78716C), // Warm Taupe
        Color(hex: 0x713F12), // Chocolate Brown
        Color(hex: 0xFACC15), // Sunny Yellow
        Color(hex: 0xF97316), // Juicy Orange
        Color(hex: 0x84CC16), // Apple Green
        Color(hex: 0x10B981), // Emerald Green
        Color(hex: 0x0EA5E9), // Sky Blue
        Color(hex: 0x2563EB), // Royal Blue
        Color(hex: 0x1F2937), // Charcoal
        Color(hex: 0xFFFFFF)  // Pure White
    ]
}

// MARK: Reference colors

private enum SidebarStyle {
    static let rackStart = Color(hex: 0xD6ECFC)
    static let rackMid = Color(hex: 0xBFE3FB)
    static let blueTop = Color(hex: 0x3D9BF2)
    static let blueBottom = Color(hex: 0x2F86E0)
    static let clearTop = Color(hex: 0xF7A07E)
    static let clearMid = Color(hex: 0xEE7650)
    static let clearBottom = Color(hex: 0xD95A3A)
    static let clearEdge = Color(hex: 0xB54528)
    static let saveTop = Color(hex: 0xF25A4E)
    static let saveMid = Color(hex: 0xE0392E)
    static let saveBottom = Color(hex: 0xC0261D)
    static let saveEdge = Color(hex: 0x8F1B14)
    static let handleTop = Color(hex: 0xC47A2E)
    static let handleBottom = Color(hex: 0x8A4511)
    static let metalTop = Color(hex: 0xE5E9EF)
    static let metalBottom = Color(hex: 0x8A93A0)
}

// MARK: Tool cards

private struct SidebarToolCard: Identifiable {
    let id: String
    let tool: DrawingTool
    let title: String
    let icon: String
    let fill: Color
    let activeFill: Color
    let iconColor: Color
}

private let sidebarToolCards: [SidebarToolCard] = [
    SidebarToolCard(id: "pencil", tool: .pencil, title: "Graphite Pencil", icon: "pencil",
                    fill: Color(hex: 0xFCD53F), activeFill: Color(hex: 0xFFE27A), iconColor: Color(hex: 0x16A34A)),
    SidebarToolCard(id: "brush", tool: .brush, title: "Studio Brush", icon: "paintbrush.pointed.fill",
                    fill: Color(hex: 0xC9B4F7), activeFill: Color(hex: 0xE3D6FC), iconColor: Color(hex: 0x9333EA)),
    SidebarToolCard(id: "marker", tool: .highlighter, title: "Marker", icon: "highlighter",
                    fill: Color(hex: 0x7FD99A), activeFill: Color(hex: 0xA8E9BB), iconColor: Color(hex: 0x10B981)),
    SidebarToolCard(id: "pen", tool: .pen, title: "Studio Pen", icon: "pencil.tip",
                    fill: Color(hex: 0xF7B8C4), activeFill: Color(hex: 0xFBD0DA), iconColor: Color(hex: 0xE11D48))
]

// MARK: - Main sidebar view

public struct ColorToolSidebarView: View {
    @ObservedObject var state: TracingAppState
    let onClear: () -> Void
    let onSave: () -> Void

    public init(state: TracingAppState, onClear: @escaping () -> Void, onSave: @escaping () -> Void) {
        self.state = state
        self.onClear = onClear
        self.onSave = onSave
    }

    public var body: some View {
        VStack(spacing: 12) {
            clearButton

            HStack(spacing: 0) {
                colorRack
                toolColumn
            }
            .background(SidebarStyle.blueTop)
            .clipShape(RoundedRectangle(cornerRadius: 22, style: .continuous))
            .shadow(color: Color.black.opacity(0.35), radius: 12, x: 0, y: 8)

            saveButton
        }
    }

    // MARK: Pieces

    private var clearButton: some View {
        Button(action: onClear) {
            ZStack {
                SquircleButtonBackground(top: SidebarStyle.clearTop,
                                         mid: SidebarStyle.clearMid,
                                         bottom: SidebarStyle.clearBottom,
                                         edge: SidebarStyle.clearEdge)
                Image(systemName: "xmark")
                    .font(.system(size: 22, weight: .heavy))
                    .foregroundColor(Color(hex: 0xFBE3D0))
            }
            .frame(width: 56, height: 56)
        }
        .buttonStyle(SquishButtonStyle())
        .accessibilityLabel("Clear drawing")
    }

    private var saveButton: some View {
        Button(action: onSave) {
            ZStack {
                SquircleButtonBackground(top: SidebarStyle.saveTop,
                                         mid: SidebarStyle.saveMid,
                                         bottom: SidebarStyle.saveBottom,
                                         edge: SidebarStyle.saveEdge)
                Image(systemName: "arrow.right")
                    .font(.system(size: 22, weight: .heavy))
                    .foregroundColor(Color(hex: 0xFFF3C4))
            }
            .frame(width: 56, height: 56)
        }
        .buttonStyle(SquishButtonStyle())
        .accessibilityLabel("Save and share drawing")
    }

    private var colorRack: some View {
        ScrollView(.vertical, showsIndicators: false) {
            VStack(spacing: 6) {
                ForEach(Array(SidebarPalette.colors.enumerated()), id: \.offset) { _, color in
                    BrushSwatchButton(
                        color: color,
                        isSelected: state.selectedColor == color,
                        action: { selectColor(color) }
                    )
                }
            }
            .padding(.vertical, 12)
            .padding(.horizontal, 8)
        }
        .frame(width: 150, height: 520)
        .background(
            LinearGradient(colors: [SidebarStyle.rackStart, SidebarStyle.rackMid, SidebarStyle.rackStart],
                           startPoint: .top, endPoint: .bottom)
        )
    }

    private var toolColumn: some View {
        VStack(spacing: 10) {
            ForEach(sidebarToolCards) { card in
                ToolCardButton(
                    card: card,
                    isActive: state.currentTool == card.tool,
                    action: { selectTool(card.tool) }
                )
            }
        }
        .padding(.vertical, 12)
        .padding(.horizontal, 8)
        .frame(width: 72)
        .frame(maxHeight: .infinity)
        .background(
            LinearGradient(colors: [SidebarStyle.blueTop, SidebarStyle.blueBottom],
                           startPoint: .top, endPoint: .bottom)
        )
    }

    // MARK: Actions (same rules as the bottom toolbar)

    private func selectColor(_ color: Color) {
        state.selectedColor = color
        if state.currentTool == .eraser {
            state.currentTool = .brush
        }
    }

    private func selectTool(_ tool: DrawingTool) {
        state.currentTool = tool
    }
}

// MARK: - Brush swatch

private struct BrushSwatchButton: View {
    let color: Color
    let isSelected: Bool
    let action: () -> Void

    var body: some View {
        Button(action: action) {
            BrushSwatchArt(color: color)
                .frame(width: 124, height: 34)
                .overlay(
                    // White outline on the selected swatch's tip, as in the reference
                    SidebarPetalShape()
                        .stroke(Color.white, lineWidth: isSelected ? 2 : 0)
                        .frame(width: 44, height: 34)
                        .frame(maxWidth: .infinity, alignment: .leading)
                )
                .offset(x: isSelected ? -8 : 0)
                .scaleEffect(isSelected ? 1.05 : 1.0)
                .animation(.spring(response: 0.25, dampingFraction: 0.75), value: isSelected)
        }
        .buttonStyle(.plain)
        .accessibilityLabel(isSelected ? "Selected color" : "Color")
    }
}

// Brush artwork: pointed paint tip, metal ferrule, wooden handle
private struct BrushSwatchArt: View {
    let color: Color

    var body: some View {
        HStack(spacing: 0) {
            SidebarPetalShape()
                .fill(
                    LinearGradient(colors: [Color.white.opacity(0.55), color, Color.black.opacity(0.2)],
                                   startPoint: .top, endPoint: .bottom)
                )
                .frame(width: 44, height: 34)

            Rectangle()
                .fill(LinearGradient(colors: [SidebarStyle.metalTop, SidebarStyle.metalBottom],
                                     startPoint: .top, endPoint: .bottom))
                .frame(width: 22, height: 22)

            RoundedRectangle(cornerRadius: 4, style: .continuous)
                .fill(LinearGradient(colors: [SidebarStyle.handleTop, SidebarStyle.handleBottom],
                                     startPoint: .top, endPoint: .bottom))
                .frame(height: 9)
        }
    }
}

// Pointed on the left, rounded on the right
private struct SidebarPetalShape: Shape {
    func path(in rect: CGRect) -> Path {
        var path = Path()
        path.move(to: CGPoint(x: rect.maxX, y: rect.minY))
        path.addQuadCurve(to: CGPoint(x: rect.minX, y: rect.midY),
                          control: CGPoint(x: rect.width * 0.35, y: rect.minY))
        path.addQuadCurve(to: CGPoint(x: rect.maxX, y: rect.maxY),
                          control: CGPoint(x: rect.width * 0.35, y: rect.maxY))
        path.closeSubpath()
        return path
    }
}

// MARK: - Tool card

private struct ToolCardButton: View {
    let card: SidebarToolCard
    let isActive: Bool
    let action: () -> Void

    var body: some View {
        Button(action: action) {
            ZStack {
                RoundedRectangle(cornerRadius: 14, style: .continuous)
                    .fill(isActive ? card.activeFill : card.fill)
                    .shadow(color: Color.black.opacity(0.15), radius: 0, x: 0, y: 3)

                Circle()
                    .fill(Color.white)
                    .frame(width: 42, height: 42)
                    .overlay(
                        Image(systemName: card.icon)
                            .font(.system(size: 17, weight: .bold))
                            .foregroundColor(card.iconColor)
                    )

                if isActive {
                    RoundedRectangle(cornerRadius: 14, style: .continuous)
                        .stroke(Color.white, lineWidth: 3)
                }
            }
            .frame(width: 56, height: 56)
            .overlay(alignment: .leading) {
                if isActive {
                    // Pointer toward the color rack
                    SidebarPointer()
                        .fill(Color.white)
                        .frame(width: 7, height: 12)
                        .offset(x: -8)
                }
            }
            .scaleEffect(isActive ? 1.05 : 1.0)
        }
        .buttonStyle(.plain)
        .accessibilityLabel(card.title)
    }
}

private struct SidebarPointer: Shape {
    func path(in rect: CGRect) -> Path {
        var p = Path()
        p.move(to: CGPoint(x: rect.maxX, y: rect.midY))
        p.addLine(to: CGPoint(x: rect.minX, y: rect.minY))
        p.addLine(to: CGPoint(x: rect.minX, y: rect.maxY))
        p.closeSubpath()
        return p
    }
}

// MARK: - Squircle button

private struct SquircleButtonBackground: View {
    let top: Color
    let mid: Color
    let bottom: Color
    let edge: Color

    var body: some View {
        RoundedRectangle(cornerRadius: 18, style: .continuous)
            .fill(LinearGradient(colors: [top, mid, bottom], startPoint: .top, endPoint: .bottom))
            .overlay(
                RoundedRectangle(cornerRadius: 18, style: .continuous)
                    .stroke(Color.white.opacity(0.45), lineWidth: 3)
            )
            .shadow(color: edge, radius: 0, x: 0, y: 5)
            .shadow(color: Color.black.opacity(0.25), radius: 8, x: 0, y: 8)
    }
}

private struct SquishButtonStyle: ButtonStyle {
    func makeBody(configuration: Configuration) -> some View {
        configuration.label
            .scaleEffect(configuration.isPressed ? 0.95 : 1.0)
            .animation(.easeOut(duration: 0.12), value: configuration.isPressed)
    }
}

// MARK: - Helpers

private extension Color {
    init(hex: UInt32) {
        let r = Double((hex >> 16) & 0xFF) / 255.0
        let g = Double((hex >> 8) & 0xFF) / 255.0
        let b = Double(hex & 0xFF) / 255.0
        self.init(red: r, green: g, blue: b)
    }
}
