import SwiftUI

// MARK: - Dark-Themed Professional Bottom Toolbar with Expandable Brush Controls

public struct BottomToolbarView: View {
    @ObservedObject public var state: TracingAppState
    @Binding public var isTargetPickerPresented: Bool
    @Binding public var isExportPresented: Bool
    
    @State private var isBrushKitExpanded: Bool = false
    
    public init(
        state: TracingAppState,
        isTargetPickerPresented: Binding<Bool>,
        isExportPresented: Binding<Bool>
    ) {
        self.state = state
        self._isTargetPickerPresented = isTargetPickerPresented
        self._isExportPresented = isExportPresented
    }
    
    public var body: some View {
        HStack {
            Spacer(minLength: 0)
            VStack(spacing: 12) {
                if isBrushKitExpanded {
                    brushKitPanel
                }
                mainToolbarCapsule
            }
            .frame(maxHeight: .infinity, alignment: .center)
        }
        .padding(.trailing, 14)
        .padding(.vertical, 14)
    }
    
    // MARK: - Decomposed Modular Subviews
    
    private var brushKitPanel: some View {
        VStack(spacing: 16) {
            Text(state.currentTool == .eraser ? "Eraser Size" : "Brush & Color")
                .font(.system(size: 15, weight: .black, design: .rounded))
                .foregroundColor(Color(red: 0.12, green: 0.14, blue: 0.20))
            if state.currentTool == .eraser {
                eraserSizeChoices
            } else {
                brushSizeChoices
                opacityChoices
                colorSwatchesRow
            }
        }
        .padding(16)
        .background(Color.white.opacity(0.96))
        .cornerRadius(22)
        .overlay(
            RoundedRectangle(cornerRadius: 22)
                .stroke(Color(red: 0.961, green: 0.620, blue: 0.043).opacity(0.30), lineWidth: 1)
        )
        .padding(.horizontal, 16)
        .transition(.scale.combined(with: .opacity))
    }
    
    private var colorSwatchesRow: some View {
        ScrollView(.horizontal, showsIndicators: false) {
            HStack(spacing: 10) {
                ForEach(state.vibrantColors, id: \.self) { color in
                    let isSelected: Bool = (state.selectedColor == color && state.currentTool == .brush)
                    Button {
                        state.selectedColor = color
                        state.currentTool = .brush
                    } label: {
                        Circle()
                            .fill(color)
                            .frame(width: isSelected ? 32 : 26, height: isSelected ? 32 : 26)
                            .overlay(
                                Circle()
                                    .stroke(Color.white, lineWidth: isSelected ? 2.5 : 1)
                            )
                            .shadow(color: isSelected ? color.opacity(0.6) : .clear, radius: 6)
                    }
                }
            }
            .padding(.horizontal, 4)
            .padding(.vertical, 4)
        }
    }
    
    private var brushSizeChoices: some View {
        sizeChoiceRow(title: "Brush size", values: [4, 8, 14, 22, 32], selected: state.lineWidth) { state.lineWidth = $0 }
    }

    private var eraserSizeChoices: some View {
        sizeChoiceRow(title: "Eraser size", values: [10, 18, 28, 40, 56], selected: state.eraserSize) { state.eraserSize = $0 }
    }

    private var opacityChoices: some View {
        HStack(spacing: 8) {
            Text("Opacity").font(.system(size: 12, weight: .bold)).foregroundColor(.secondary)
            ForEach([0.35, 0.55, 0.75, 1.0], id: \.self) { value in
                Button { state.brushOpacity = value } label: {
                    Text("\(Int(value * 100))%").font(.system(size: 11, weight: .bold, design: .rounded))
                        .foregroundColor(state.brushOpacity == value ? .white : .primary)
                        .padding(.horizontal, 9).padding(.vertical, 7)
                        .background(state.brushOpacity == value ? Color.blue : Color.black.opacity(0.06))
                        .clipShape(Capsule())
                }.buttonStyle(.plain)
            }
        }
    }

    private func sizeChoiceRow(title: String, values: [CGFloat], selected: CGFloat, onSelect: @escaping (CGFloat) -> Void) -> some View {
        HStack(spacing: 10) {
            Text(title).font(.system(size: 12, weight: .bold)).foregroundColor(.secondary)
            ForEach(values, id: \.self) { value in
                Button { onSelect(value) } label: {
                    Circle().fill(selected == value ? Color.orange : Color.black.opacity(0.08))
                        .frame(width: 42, height: 42)
                        .overlay(Circle().stroke(selected == value ? Color.orange.opacity(0.35) : .clear, lineWidth: 4))
                        .overlay(Circle().fill(selected == value ? .white : .primary).frame(width: min(max(value / 2, 4), 18), height: min(max(value / 2, 4), 18)))
                }.buttonStyle(.plain).accessibilityLabel("\(Int(value)) point \(title)")
            }
        }
    }

    private var mainToolbarCapsule: some View {
        VStack(spacing: 10) {
            targetButton
            brushToolButton
            eraserToolButton
            undoRedoButtons
            exportButton
        }
        .padding(.horizontal, 12)
        .padding(.vertical, 10)
        .background(.ultraThinMaterial)
        .clipShape(Capsule())
        .overlay(
            Capsule()
                .stroke(Color(red: 0.961, green: 0.620, blue: 0.043).opacity(0.72), lineWidth: 1.5)
        )
        .shadow(color: .black.opacity(0.14), radius: 18, y: 7)
        .padding(.horizontal, 16)
        .padding(.bottom, 10)
    }
    
    private var targetButton: some View {
        Button {
            isTargetPickerPresented = true
        } label: {
            HStack(spacing: 6) {
                Image(systemName: "sparkles")
                    .font(.system(size: 13, weight: .bold))
                    .foregroundColor(.cyan)
                Text("Drawing")
                    .font(.system(size: 13, weight: .bold, design: .rounded))
                    .foregroundColor(.white)
            }
            .padding(.horizontal, 12)
            .padding(.vertical, 8)
            .background(Color.white.opacity(0.08))
            .clipShape(Capsule())
        }
        .help("Select Drawing from Vector Library, Photos, or Files")
    }
    
    private var dividerView: some View {
        Divider()
            .frame(height: 20)
            .background(Color.white.opacity(0.2))
    }
    
    private var brushToolButton: some View {
        Button {
            state.currentTool = .brush
            withAnimation(.spring(response: 0.3, dampingFraction: 0.7)) {
                isBrushKitExpanded.toggle()
            }
        } label: {
            HStack(spacing: 6) {
                Image(systemName: "paintbrush.pointed.fill")
                    .font(.system(size: 14, weight: .bold))
                    .foregroundColor(state.currentTool == .brush ? .black : .white)
                Circle()
                    .fill(state.selectedColor)
                    .frame(width: 10, height: 10)
                    .overlay(Circle().stroke(Color.black.opacity(0.3), lineWidth: 1))
            }
            .padding(.horizontal, 12)
            .padding(.vertical, 8)
            .background(state.currentTool == .brush ? Color(red: 0.961, green: 0.620, blue: 0.043) : Color.black.opacity(0.05))
            .clipShape(Capsule())
        }
        .help("Brush Tool & Vibrant Color Swatches")
    }
    
    private var eraserToolButton: some View {
        Button {
            state.currentTool = .eraser
            withAnimation(.spring(response: 0.3, dampingFraction: 0.7)) {
                isBrushKitExpanded = true
            }
        } label: {
            Image(systemName: "eraser.fill")
                .font(.system(size: 14, weight: .bold))
                .foregroundColor(state.currentTool == .eraser ? .black : .white)
                .frame(width: 36, height: 36)
                .background(state.currentTool == .eraser ? Color.white : Color.white.opacity(0.08))
                .clipShape(Circle())
        }
        .help("Pixel-Accurate Eraser (Leaves Reference Untouched)")
    }
    
    private var undoRedoButtons: some View {
        HStack(spacing: 5) {
            Button {
                state.undo()
            } label: {
                Image(systemName: "arrow.uturn.backward")
                    .font(.system(size: 13, weight: .bold))
                    .foregroundColor(state.canUndo ? .white : .gray.opacity(0.4))
                    .frame(width: 32, height: 32)
                    .background(Color.white.opacity(state.canUndo ? 0.10 : 0.04))
                    .clipShape(Circle())
            }
            .disabled(!state.canUndo)
            
            Button {
                state.redo()
            } label: {
                Image(systemName: "arrow.uturn.forward")
                    .font(.system(size: 13, weight: .bold))
                    .foregroundColor(state.canRedo ? .white : .gray.opacity(0.4))
                    .frame(width: 32, height: 32)
                    .background(Color.white.opacity(state.canRedo ? 0.10 : 0.04))
                    .clipShape(Circle())
            }
            .disabled(!state.canRedo)
        }
    }
    
    private var exportButton: some View {
        Button {
            isExportPresented = true
        } label: {
            HStack(spacing: 4) {
                Image(systemName: "square.and.arrow.up")
                    .font(.system(size: 12, weight: .bold))
                Text("Export")
                    .font(.system(size: 12, weight: .bold))
            }
            .foregroundColor(.cyan)
            .padding(.horizontal, 10)
            .padding(.vertical, 7)
            .background(Color.cyan.opacity(0.18))
            .clipShape(Capsule())
            .overlay(
                Capsule().stroke(Color.cyan.opacity(0.3), lineWidth: 1)
            )
        }
        .help("Export Drawing to iOS Photos Library")
    }
}
