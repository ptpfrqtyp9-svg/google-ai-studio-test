import SwiftUI

// MARK: - Dark-Themed Professional Bottom Toolbar with Expandable Brush Controls

public struct BottomToolbarView: View {
    @ObservedObject public var state: TracingAppState
    @Binding public var isTargetPickerPresented: Bool
    @Binding public var isExportPresented: Bool
    
    @State private var isBrushKitExpanded: Bool = false
    @State private var isReferenceSlidersExpanded: Bool = false
    
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
        VStack(spacing: 12) {
            if isBrushKitExpanded {
                brushKitPanel
            }
            if isReferenceSlidersExpanded {
                referenceSlidersPanel
            }
            mainToolbarCapsule
        }
    }
    
    // MARK: - Decomposed Modular Subviews
    
    private var brushKitPanel: some View {
        VStack(spacing: 16) {
            thicknessSliderRow
            opacitySliderRow
            colorSwatchesRow
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
    
    private var thicknessSliderRow: some View {
        HStack(spacing: 12) {
            Image(systemName: "pencil.tip")
                .font(.system(size: 14, weight: .bold))
                .foregroundColor(Color(red: 0.35, green: 0.35, blue: 0.38))
                .frame(width: 20)
            
            Text("Thickness")
                .font(.system(size: 13, weight: .semibold))
                .foregroundColor(Color(red: 0.11, green: 0.11, blue: 0.13))
                .frame(width: 75, alignment: .leading)
            
            Slider(value: $state.lineWidth, in: 1...40, step: 1)
                .tint(Color(red: 0.961, green: 0.620, blue: 0.043))
            
            Text("\(Int(state.lineWidth)) pt")
                .font(.system(size: 12, weight: .bold, design: .monospaced))
                .foregroundColor(.white)
                .frame(width: 44, alignment: .trailing)
        }
    }
    
    private var opacitySliderRow: some View {
        HStack(spacing: 12) {
            Image(systemName: "drop.fill")
                .font(.system(size: 14, weight: .bold))
                .foregroundColor(.gray)
                .frame(width: 20)
            
            Text("Opacity")
                .font(.system(size: 13, weight: .semibold))
                .foregroundColor(.white)
                .frame(width: 75, alignment: .leading)
            
            Slider(value: $state.brushOpacity, in: 0.1...1.0, step: 0.05)
                .tint(.blue)
            
            Text("\(Int(state.brushOpacity * 100))%")
                .font(.system(size: 12, weight: .bold, design: .monospaced))
                .foregroundColor(.white)
                .frame(width: 44, alignment: .trailing)
        }
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
    
    private var referenceSlidersPanel: some View {
        HStack(spacing: 12) {
            Image(systemName: "slider.horizontal.3")
                .font(.system(size: 14, weight: .bold))
                .foregroundColor(Color(red: 0.961, green: 0.620, blue: 0.043))
            
            Text("Template Alpha")
                .font(.system(size: 13, weight: .semibold))
                .foregroundColor(.cyan)
            
            Slider(value: $state.referenceOpacity, in: 0.0...1.0, step: 0.05)
                .tint(.cyan)
                .onChange(of: state.referenceOpacity) { _, val in
                    state.isReferenceVisible = val > 0.01
                    if val > 0.05 {
                        state.lastActiveReferenceOpacity = val
                    }
                }
            
            Text("\(Int(state.referenceOpacity * 100))%")
                .font(.system(size: 12, weight: .bold, design: .monospaced))
                .foregroundColor(.cyan)
                .frame(width: 44, alignment: .trailing)
        }
        .padding(.horizontal, 16)
        .padding(.vertical, 12)
        .background(Color(red: 0.14, green: 0.14, blue: 0.16).opacity(0.95))
        .cornerRadius(18)
        .overlay(
            RoundedRectangle(cornerRadius: 18)
                .stroke(Color.cyan.opacity(0.25), lineWidth: 1)
        )
        .padding(.horizontal, 16)
        .transition(.scale.combined(with: .opacity))
    }
    
    private var mainToolbarCapsule: some View {
        HStack(spacing: 10) {
            targetButton
            alignmentButton
            quickEyeButton
            slidersToggleButton
            
            dividerView
            
            brushToolButton
            eraserToolButton
            
            Spacer()
            
            undoRedoButtons
            
            dividerView
            
            exportButton
        }
        .padding(.horizontal, 12)
        .padding(.vertical, 10)
        .background(Color.white.opacity(0.96))
        .clipShape(Capsule())
        .overlay(
            Capsule()
                .stroke(Color(red: 0.961, green: 0.620, blue: 0.043).opacity(0.45), lineWidth: 1)
        )
        .shadow(color: .black.opacity(0.5), radius: 16, y: 6)
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
    
    private var alignmentButton: some View {
        Button {
            withAnimation(.spring(response: 0.3, dampingFraction: 0.7)) {
                state.isAdjustingReference.toggle()
            }
        } label: {
            Image(systemName: "arrow.up.and.down.and.arrow.left.and.right")
                .font(.system(size: 14, weight: .bold))
                .foregroundColor(state.isAdjustingReference ? .black : .white)
                .frame(width: 36, height: 36)
                .background(state.isAdjustingReference ? Color.cyan : Color.white.opacity(0.08))
                .clipShape(Circle())
                .shadow(color: state.isAdjustingReference ? Color.cyan.opacity(0.4) : .clear, radius: 8)
        }
        .help("Pan and Scale Tracing Reference")
    }
    
    private var quickEyeButton: some View {
        Button {
            withAnimation(.easeInOut(duration: 0.2)) {
                state.toggleReferenceEye()
            }
        } label: {
            Image(systemName: state.isReferenceVisible ? "eye.fill" : "eye.slash.fill")
                .font(.system(size: 14, weight: .semibold))
                .foregroundColor(state.isReferenceVisible ? .cyan : .gray)
                .frame(width: 36, height: 36)
                .background(Color.white.opacity(0.08))
                .clipShape(Circle())
        }
        .help("Quick Eye Toggle (0% vs Previous Opacity)")
    }
    
    private var slidersToggleButton: some View {
        Button {
            withAnimation(.spring(response: 0.3, dampingFraction: 0.7)) {
                isReferenceSlidersExpanded.toggle()
            }
        } label: {
            Image(systemName: "slider.horizontal.3")
                .font(.system(size: 13, weight: .semibold))
                .foregroundColor(isReferenceSlidersExpanded ? .cyan : .gray)
                .frame(width: 32, height: 32)
                .background(isReferenceSlidersExpanded ? Color.cyan.opacity(0.15) : Color.clear)
                .clipShape(Circle())
        }
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
            isBrushKitExpanded = false
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
